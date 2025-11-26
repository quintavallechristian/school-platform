import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const payload = await getPayloadHMR({ config })

    // Get user from payload-token cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    // Verify token and get user
    let user
    try {
      const result = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
      user = result.user
    } catch (_error) {
      return NextResponse.json({ error: 'Token non valido' }, { status: 401 })
    }

    // Solo genitori possono prenotare
    if (!user || user.role !== 'parent') {
      return NextResponse.json({ error: 'Solo i genitori possono prenotare' }, { status: 403 })
    }

    const body = await req.json()
    const { calendarEventId, timeSlot } = body

    if (!calendarEventId) {
      return NextResponse.json({ error: 'ID evento mancante' }, { status: 400 })
    }

    // Fetch the calendar event
    const calendarEvent = await payload.findByID({
      collection: 'calendar-days',
      id: calendarEventId,
      depth: 0,
    })

    if (!calendarEvent) {
      return NextResponse.json({ error: 'Evento non trovato' }, { status: 404 })
    }

    // Check if the event is bookable
    if (!calendarEvent.isBookable) {
      return NextResponse.json({ error: 'Questo evento non è prenotabile' }, { status: 400 })
    }

    // Check booking deadline if set
    if (calendarEvent.bookingSettings?.bookingDeadline) {
      const deadline = new Date(calendarEvent.bookingSettings.bookingDeadline)
      if (new Date() > deadline) {
        return NextResponse.json(
          { error: 'Il termine per le prenotazioni è scaduto' },
          { status: 400 },
        )
      }
    }

    // If using time slots, validate the slot
    if (calendarEvent.bookingSettings?.useTimeSlots) {
      if (!timeSlot) {
        return NextResponse.json({ error: 'Devi selezionare una fascia oraria' }, { status: 400 })
      }

      // Check if the slot is already taken
      const slotBookings = await payload.find({
        collection: 'parent-appointments',
        where: {
          and: [
            {
              calendarEvent: {
                equals: calendarEventId,
              },
            },
            {
              timeSlot: {
                equals: timeSlot,
              },
            },
            {
              status: {
                in: ['pending', 'scheduled'],
              },
            },
          ],
        },
      })

      if (slotBookings.docs.length > 0) {
        return NextResponse.json(
          { error: 'Questa fascia oraria è già stata prenotata' },
          { status: 400 },
        )
      }
    }

    // Check if max capacity is reached (for non-slot bookings)
    if (!calendarEvent.bookingSettings?.useTimeSlots && calendarEvent.bookingSettings?.maxCapacity) {
      const existingBookings = await payload.find({
        collection: 'parent-appointments',
        where: {
          and: [
            {
              calendarEvent: {
                equals: calendarEventId,
              },
            },
            {
              status: {
                in: ['pending', 'scheduled'],
              },
            },
          ],
        },
      })

      if (existingBookings.docs.length >= calendarEvent.bookingSettings.maxCapacity) {
        return NextResponse.json({ error: 'Posti esauriti' }, { status: 400 })
      }
    }

    // Check if the parent has already booked this event
    const existingUserBooking = await payload.find({
      collection: 'parent-appointments',
      where: {
        and: [
          {
            calendarEvent: {
              equals: calendarEventId,
            },
          },
          {
            parent: {
              equals: user.id,
            },
          },
          {
            status: {
              in: ['pending', 'scheduled'],
            },
          },
        ],
      },
    })

    if (existingUserBooking.docs.length > 0) {
      return NextResponse.json({ error: 'Hai già prenotato questo evento' }, { status: 400 })
    }

    // Get the school from user
    const userSchools = user.schools as string[] | undefined
    const schoolId = userSchools?.[0] || calendarEvent.school

    if (!schoolId) {
      return NextResponse.json({ error: 'Scuola non trovata' }, { status: 400 })
    }

    // Determine initial status based on requiresApproval setting
    const requiresApproval = calendarEvent.bookingSettings?.requiresApproval !== false
    const status = requiresApproval ? 'pending' : 'scheduled'

    // Create the appointment
    const appointment = await payload.create({
      collection: 'parent-appointments',
      data: {
        school: schoolId as any,
        parent: user.id,
        calendarEvent: calendarEventId,
        title: `Prenotazione: ${calendarEvent.title}${timeSlot ? ` - ${timeSlot}` : ''}`,
        description: calendarEvent.description || '',
        date: calendarEvent.startDate,
        timeSlot: timeSlot || undefined,
        location: calendarEvent.bookingSettings?.location || '',
        status,
      },
    })

    return NextResponse.json({
      success: true,
      appointment,
      message: requiresApproval
        ? 'Prenotazione inviata! Riceverai una conferma quando verrà approvata.'
        : 'Prenotazione confermata!',
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Errore durante la prenotazione' }, { status: 500 })
  }
}
