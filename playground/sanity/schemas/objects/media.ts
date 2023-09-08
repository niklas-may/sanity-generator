import { Resolver } from "./../../../../src/types/";

export const mediaSchema = {
  type: "object",
  name: "media",
  fields: [
    {
      type: "string",
      name: "type",
      title: "Type",
      options: {
        list: ["image", "video"],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "image",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "mood",
      title: "Mood Video",
      description: "Automatic playback without audio. Videos should be max. 10 seconds long.",
      type: "file",
      hidden: ({ parent }) => parent?.type !== "video",
    },
    {
      name: "player",
      title: "Video Player",
      description:
        "Video Player with all playback controls. If combined with a mood video, the mood video will replace the image poster.",
      type: "file",
      hidden: ({ parent }) => parent?.type !== "video",
    },
    {
      name: "image",
      type: "image",
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.type !== "image",
    },
  ],
  preview: {
    select: {
      type: "type",
      mood: "mood.asset.playbackId",
      player: "player.asset.playbackId",
      image: "image",
    },
    prepare(args) {
      if (args.type === "video") {
        const thumbnail = `https://image.mux.com/${args.mood || args.player}/thumbnail.jpg`;
        return {
          title: [args.mood && "Mood Video", args.player && "Video Player"].filter(Boolean).join(" and "),
          // media: () => Image({src: thumbnail}),
        };
      } else {
        return {
          title: "Image",
          media: args.image,
        };
      }
    },
  },
};

export const mediaResolver: Resolver = (name: string) => /* groq */ `
    "${name}": {
      _type,
      type == 'image' => {
        'image': image.asset->{
        url,
        'lqip': metadata.lqip,
        'ratio': metadata.dimensions.aspectRatio
      },
      hotspot,
      crop,
      },
      type == 'video' => {
        'player': player.asset->{
          'playbackId': playbackId,
          'ratio': data.aspect_ratio,
          thumbTime
      
        },
        'mood': mood.asset -> {
        'playbackId': playbackId,
        'ratio': data.aspect_ratio
        }
      }
    }
`;
