import {Resolver} from './../../../src/types/index'
import {defineField} from 'sanity'
import {Video} from '../../components/Video'
type Options = {
  video?: boolean
}
const defaultOptions: Options = {
  video: true,
}

export function mediaFactory(name: string, group = '', options: Options = defaultOptions) {
  return defineField({
    name,
    group,
    type: 'object',
    options: {
      collapsible: false,
    },
    fields: [
      defineField({
        name: 'type',
        title: 'Type',
        type: 'string',
        options: {
          list: ['image', 'video'],
          layout: 'radio',
          direction: 'horizontal',
        },
        hidden: options.video === false,
        initialValue: 'image',
      }),
      defineField({
        name: 'mood',
        title: 'Mood Video',
        description: 'Automatic playback without audio. Videos should be max. 10 seconds long.',
        type: 'file',
        hidden: ({parent}) => parent?.type !== 'video' || options.video === false,
      }),
      defineField({
        name: 'player',
        title: 'Video Player',
        description:
          'Video Player with all playback controls. If combined with a mood video, the mood video will replace the image poster.',
        type: 'file',
        hidden: ({parent}) => parent?.type !== 'video' || options.video === false,
      }),
      defineField({
        name: 'image',
        type: 'image',
        options: {
          hotspot: true,
        },
        hidden: ({parent}) => {
          const hidden = parent?.type === undefined ? false : parent?.type !== 'image'
          return hidden
        },
      }),
    ],
    preview: {
      select: {
        type: 'type',
        mood: 'mood.asset.url',
        player: 'player.asset.url',
        image: 'image',
      },
      prepare(args) {
        if (args.type === 'video') {
          return {
            title: [args.mood && 'Mood Video', args.player && 'Video Player']
              .filter(Boolean)
              .join(' and '),
            media: () => Video({src: args.mood || args.player}),
          }
        } else {
          return {
            title: 'Image',
            media: args.image,
          }
        }
      },
    },
    generator: {
      resolver,
    },
  })
}

const resolver: Resolver = (name) => /* groq */`
${name} {
    _type,
    type,
    type == "image" => {
      image {
          "title": asset -> title,
          "altText": asset -> altText,
          "src": asset -> url,
          "metaData": {
          "crop": crop,
          "hotspot": hotspot,
          "width": asset -> metadata.dimensions.width,
          "height": asset -> metadata.dimensions.height,
          }
      },
    },
    type == "video" => {
    "player": player.asset -> {
        "playbackId": playbackId,
        "ratio": data.aspect_ratio,
        thumbTime
        
    },
    "mood": mood.asset -> {
        "playbackId": playbackId,
        "ratio": data.aspect_ratio
        }
    }
    
}
`



