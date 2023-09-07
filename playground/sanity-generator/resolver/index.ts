export const localeString = (name) => /* groq */ `
    "${name}": coalesce(${name}[$lang], ${name}.en)
`;

export const media = (name) => /* groq */ `
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
