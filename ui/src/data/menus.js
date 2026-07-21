import americanoIceImage from '../assets/americano-ice.jpg'
import americanoHotImage from '../assets/americano-hot.jpg'
import cafeLatteImage from '../assets/cafe-latte.jpg'

export const OPTIONS = [
  { id: 'extra-shot', name: '샷 추가', price: 500 },
  { id: 'extra-syrup', name: '시럽 추가', price: 0 },
]

export const MENUS = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '시원하고 깔끔한 아이스 아메리카노',
    imageUrl: americanoIceImage,
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '진한 에스presso의 깊은 풍미',
    imageUrl: americanoHotImage,
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '부드러운 우유와 에스presso의 조화',
    imageUrl: cafeLatteImage,
  },
]
