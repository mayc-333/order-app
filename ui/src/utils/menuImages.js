import americanoIceImage from '../assets/americano-ice.jpg'
import americanoHotImage from '../assets/americano-hot.jpg'
import cafeLatteImage from '../assets/cafe-latte.jpg'

const IMAGE_MAP = {
  '/images/americano-ice.jpg': americanoIceImage,
  '/images/americano-hot.jpg': americanoHotImage,
  '/images/cafe-latte.jpg': cafeLatteImage,
}

export function resolveMenuImage(imageUrl) {
  return IMAGE_MAP[imageUrl] ?? imageUrl
}
