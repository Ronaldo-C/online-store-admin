import EditorJS, { OutputData } from '@editorjs/editorjs'
import { Box, Typography } from '@mui/material'
import { useEffect, useRef } from 'react'
import Header from 'editorjs-header-with-alignment'
import List from '@editorjs/list'
import IndentTune from 'editorjs-indent-tune'
import ColorPlugin from 'editorjs-text-color-plugin'
import ImageTool from '@editorjs/image'
import { assetService } from '@/services/asset'
import axios from 'axios'

const EDITOR_ID = 'EDITOR_ID'

export default function Editor({
  onChange,
  label,
  disabled,
  defaultValue,
}: {
  value?: OutputData
  defaultValue?: OutputData
  onChange: (value: OutputData) => void
  label?: string
  disabled?: boolean
}) {
  const ejInstance = useRef<EditorJS | null>(null)

  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITOR_ID,
      data: defaultValue,
      onReady: () => {
        ejInstance.current = editor
      },
      autofocus: true,
      onChange: async () => {
        const content = await editor.saver.save()
        onChange(content)
      },
      tools: {
        indentTune: IndentTune,
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 1,
            defaultAlignment: 'left',
          },
        },
        list: {
          class: List,
          tunes: ['indentTune'],
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        Color: {
          class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
          config: {
            colorCollections: [
              '#EC7878',
              '#9C27B0',
              '#673AB7',
              '#3F51B5',
              '#0070FF',
              '#03A9F4',
              '#00BCD4',
              '#4CAF50',
              '#8BC34A',
              '#CDDC39',
              '#FFF',
            ],
            defaultColor: '#FF1300',
            type: 'text',
          },
        },
        Marker: {
          class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
          config: {
            defaultColor: '#FFBF00',
            type: 'marker',
            icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`,
          },
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (file: File) => {
                const data = await new Promise(resolve => {
                  const reader = new window.FileReader()
                  reader.readAsDataURL(file)
                  reader.onload = function (event) {
                    resolve(event.target?.result || '')
                  }
                })
                const signatureInfo = await assetService.getSignature().then(res => res.data.data)
                const url = await assetService.uploadFile(file, signatureInfo)
                if (url) {
                  return {
                    success: 1,
                    file: {
                      url,
                    },
                  }
                }
                return { success: 0, file: { url: data, file: file } }
              },
              uploadByUrl: async (url: string) => {
                try {
                  const res = await axios.get(url, { responseType: 'blob' })
                  const fileName = url.split('/').pop() || ''

                  const data = await new Promise(resolve => {
                    const reader = new window.FileReader()
                    reader.readAsDataURL(res.data)
                    reader.onload = function (event) {
                      resolve(event.target?.result || '')
                    }
                  })
                  const file = new File([res.data], fileName)
                  const signatureInfo = await assetService.getSignature().then(res => res.data.data)
                  const uploadUrl = await assetService.uploadFile(file, signatureInfo)
                  if (uploadUrl) {
                    return {
                      success: 1,
                      file: {
                        url: uploadUrl,
                      },
                    }
                  }
                  return { success: 0, file: { url: data, file: file } }
                } catch (error) {
                  console.log('upload image to editorjs by url fail', error)
                }
                return { success: 0 }
              },
            },
          },
        },
      },
      tunes: ['indentTune'],
    })
  }

  useEffect(() => {
    if (ejInstance.current === null) {
      initEditor()
    }

    return () => {
      console.log(ejInstance?.current)
      ejInstance?.current?.clear()
      ejInstance?.current?.destroy()
      ejInstance.current = null
    }
  }, [defaultValue])

  useEffect(() => {
    if (ejInstance.current) {
      ejInstance.current.readOnly.toggle(disabled)
    }
  }, [disabled])

  return (
    <Box>
      {label && <Typography mb={1}>{label}</Typography>}
      <Box
        id={EDITOR_ID}
        borderRadius="8px"
        border="1px solid #e0e0e0"
        height="450px"
        overflow="auto"
      ></Box>
    </Box>
  )
}
