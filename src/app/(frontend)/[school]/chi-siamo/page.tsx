import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getCurrentSchool, getSchoolTeachers } from '@/lib/school'

export default async function ChiSiamoPage({
  params,
}: {
  params: { school: string }
}) {
  const school = await getCurrentSchool(params.school)
  
  if (!school) {
    notFound()
  }
  
  const teachers = await getSchoolTeachers(school.id)
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-6">👥 Chi Siamo</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Conosci il team di {school.name}
          </p>
        </header>
        
        {/* School Info */}
        <section className="mb-16 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {school.logo && typeof school.logo === 'object' && school.logo.url && (
              <div className="w-32 h-32 relative bg-gray-100 dark:bg-gray-700 rounded-full p-4">
                <Image 
                  src={school.logo.url} 
                  alt={school.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">{school.name}</h2>
              
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                {school.contactInfo?.address && (
                  <p className="flex items-center gap-2">
                    📍 {school.contactInfo.address}
                  </p>
                )}
                
                {school.contactInfo?.phone && (
                  <p className="flex items-center gap-2">
                    📞 <a href={`tel:${school.contactInfo.phone}`} className="hover:text-primary">{school.contactInfo.phone}</a>
                  </p>
                )}
                
                {school.contactInfo?.email && (
                  <p className="flex items-center gap-2">
                    ✉️ <a href={`mailto:${school.contactInfo.email}`} className="hover:text-primary">{school.contactInfo.email}</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Teachers */}
        {teachers.docs.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">👨‍🏫 Il Nostro Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.docs.map((teacher) => (
                <div 
                  key={teacher.id}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
                >
                  {teacher.photo && typeof teacher.photo === 'object' && teacher.photo.url && (
                    <div className="relative h-64 w-full">
                      <Image 
                        src={teacher.photo.url} 
                        alt={teacher.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{teacher.name}</h3>
                    
                    {teacher.role && (
                      <p className="text-primary font-semibold mb-3">{teacher.role}</p>
                    )}
                    
                    {teacher.bio && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {teacher.bio}
                      </p>
                    )}
                    
                    {teacher.email && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <a 
                          href={`mailto:${teacher.email}`}
                          className="text-sm text-primary hover:underline"
                        >
                          ✉️ Contatta
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {teachers.docs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Informazioni sul team in arrivo...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: { school: string }
}) {
  const school = await getCurrentSchool(params.school)
  
  if (!school) {
    return {
      title: 'Scuola non trovata',
    }
  }
  
  return {
    title: `Chi Siamo - ${school.name}`,
    description: `Conosci il team di ${school.name}. Scopri chi siamo e cosa facciamo.`,
  }
}
