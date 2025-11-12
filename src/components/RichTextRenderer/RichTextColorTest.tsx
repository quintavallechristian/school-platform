import React from 'react'
import { RichTextRenderer } from '../RichTextRenderer/RichTextRenderer'

/**
 * Componente di test per verificare il supporto alla colorazione del testo
 */
export function RichTextColorTest() {
  // Esempio di contenuto Lexical con stili di colore
  const sampleContent = {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              format: 0,
              text: 'Questo è un testo normale, ',
              version: 1,
            },
            {
              type: 'text',
              format: 1, // bold
              text: 'questo è grassetto',
              version: 1,
            },
            {
              type: 'text',
              format: 0,
              text: ', e ',
              version: 1,
            },
            {
              type: 'text',
              format: 0,
              text: 'questo è rosso',
              style: 'color: #e74c3c;',
              version: 1,
            },
            {
              type: 'text',
              format: 0,
              text: '.',
              version: 1,
            },
          ],
        },
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              format: 0,
              text: 'Testo blu con sfondo giallo',
              style: 'color: #3498db; background-color: #fff176; padding: 2px 4px;',
              version: 1,
            },
          ],
        },
        {
          type: 'heading',
          tag: 'h2',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              format: 0,
              text: 'Titolo Verde',
              version: 1,
            },
          ],
          style: 'color: #16a085;',
        },
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              format: 0,
              text: 'Testo con ',
              version: 1,
            },
            {
              type: 'text',
              format: 1,
              text: 'grassetto colorato',
              style: 'color: #9b59b6;',
              version: 1,
            },
            {
              type: 'text',
              format: 0,
              text: ' e ',
              version: 1,
            },
            {
              type: 'text',
              format: 2,
              text: 'corsivo arancione',
              style: 'color: #f39c12;',
              version: 1,
            },
            {
              type: 'text',
              format: 0,
              text: '.',
              version: 1,
            },
          ],
        },
      ],
    },
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test Colorazione Testo</h1>
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
        <RichTextRenderer content={sampleContent} />
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Come usare la colorazione:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Nell&apos;editor Lexical, passa alla modalità HTML/Source</li>
          <li>
            Usa il tag{' '}
            <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
              &lt;span style=&quot;color: #hex;&quot;&gt;
            </code>
          </li>
          <li>
            Esempio:{' '}
            <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
              &lt;span style=&quot;color: #e74c3c;&quot;&gt;Testo rosso&lt;/span&gt;
            </code>
          </li>
        </ol>
      </div>
    </div>
  )
}
