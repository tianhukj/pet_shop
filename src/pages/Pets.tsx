import { useState, useMemo } from 'react';
import { Filter, Heart, Phone, MapPin } from 'lucide-react';

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: number;
  gender: '公' | '母';
  price: number;
  image: string;
  description: string;
  category: '猫' | '狗';
}

const pets: Pet[] = [
  {
    id: 1,
    name: '小橘',
    breed: '英国短毛猫',
    age: 3,
    gender: '公',
    price: 3500,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20orange%20british%20shorthair%20cat%20sitting%20adorably%20with%20big%20round%20eyes%20fluffy%20fur%20warm%20lighting%20studio%20portrait&image_size=square_hd',
    description: '性格温顺，喜欢撒娇，已完成疫苗接种',
    category: '猫'
  },
  {
    id: 2,
    name: '雪球',
    breed: '布偶猫',
    age: 2,
    gender: '母',
    price: 5800,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20white%20ragdoll%20cat%20with%20blue%20eyes%20long%20fluffy%20fur%20sitting%20elegantly%20soft%20lighting%20adorable%20expression&image_size=square_hd',
    description: '蓝眼睛布偶，毛色纯正，性格亲人',
    category: '猫'
  },
  {
    id: 3,
    name: '咪咪',
    breed: '暹罗猫',
    age: 1,
    gender: '母',
    price: 2800,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20siamese%20cat%20with%20cream%20and%20brown%20markings%20blue%20eyes%20sleek%20body%20sitting%20gracefully%20studio%20lighting&image_size=square_hd',
    description: '活泼好动，聪明伶俐，适合家庭饲养',
    category: '猫'
  },
  {
    id: 4,
    name: '豆豆',
    breed: '金毛寻回犬',
    age: 4,
    gender: '公',
    price: 4200,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20golden%20retriever%20puppy%20with%20fluffy%20golden%20fur%20happy%20expression%20tongue%20out%20sitting%20pose%20warm%20lighting&image_size=square_hd',
    description: '温顺友善，训练有素，喜欢小朋友',
    category: '狗'
  },
  {
    id: 5,
    name: '小黑',
    breed: '拉布拉多',
    age: 2,
    gender: '公',
    price: 3800,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20black%20labrador%20puppy%20with%20shiny%20coat%20friendly%20eyes%20sitting%20happily%20studio%20portrait%20soft%20lighting&image_size=square_hd',
    description: '聪明活泼，易于训练，健康状况良好',
    category: '狗'
  },
  {
    id: 6,
    name: '花花',
    breed: '柯基犬',
    age: 3,
    gender: '母',
    price: 4500,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=adorable%20corgi%20dog%20with%20orange%20and%20white%20fur%20short%20legs%20big%20ears%20happy%20smile%20sitting%20pose%20cute%20expression&image_size=square_hd',
    description: '短腿萌犬，性格开朗，适合城市饲养',
    category: '狗'
  }
];

const breeds = Array.from(new Set(pets.map(pet => pet.breed)));
const priceRanges = [
  { label: '全部价格', min: 0, max: Infinity },
  { label: '2000-3000', min: 2000, max: 3000 },
  { label: '3000-4000', min: 3000, max: 4000 },
  { label: '4000-5000', min: 4000, max: 5000 },
  { label: '5000以上', min: 5000, max: Infinity }
];

export default function Pets() {
  const [selectedCategory, setSelectedCategory] = useState<'全部' | '猫' | '狗'>('全部');
  const [selectedBreed, setSelectedBreed] = useState<string>('全部品种');
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);

  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      const categoryMatch = selectedCategory === '全部' || pet.category === selectedCategory;
      const breedMatch = selectedBreed === '全部品种' || pet.breed === selectedBreed;
      const priceMatch = pet.price >= selectedPriceRange.min && pet.price <= selectedPriceRange.max;
      
      return categoryMatch && breedMatch && priceMatch;
    });
  }, [selectedCategory, selectedBreed, selectedPriceRange]);

  const scrollToContact = () => {
    window.location.href = '/#contact';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐾</span>
              </div>
              <span className="text-xl font-bold text-gray-800">萌宠小屋</span>
            </div>
            <div className="flex space-x-6">
              <a href="/" className="text-gray-600 hover:text-orange-500 transition-colors">首页</a>
              <a href="/booking" className="text-gray-600 hover:text-orange-500 transition-colors">预约服务</a>
              <a href="/pets" className="text-orange-500 font-medium">宠物商城</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">宠物商城</h1>
          <p className="text-gray-600">为您精选健康可爱的宠物伙伴</p>
        </div>

        {/* 筛选栏 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">筛选条件</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {/* 宠物类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">宠物类型</label>
              <div className="flex space-x-2">
                {['全部', '猫', '狗'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category as '全部' | '猫' | '狗')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* 品种筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">品种</label>
              <select
                value={selectedBreed}
                onChange={(e) => setSelectedBreed(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="全部品种">全部品种</option>
                {breeds.map((breed) => (
                  <option key={breed} value={breed}>{breed}</option>
                ))}
              </select>
            </div>

            {/* 价格区间 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">价格区间</label>
              <select
                value={selectedPriceRange.label}
                onChange={(e) => {
                  const range = priceRanges.find(r => r.label === e.target.value);
                  if (range) setSelectedPriceRange(range);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {priceRanges.map((range) => (
                  <option key={range.label} value={range.label}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 宠物展示 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzE2MS4wNDYgMTAwIDE3MCA5MC45NTQzIDE3MCA4MEM1NyA2OS4wNDU3IDE0Ny45NTQgNjAgMTM3IDYwQzEyNi4wNDYgNjAgMTE3IDY5LjA0NTcgMTE3IDgwQzExNyA5MC45NTQzIDEyNi4wNDYgMTAwIDEzNyAxMDBIMTUwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMTUwIDEyMEMxNzIuMDkxIDEyMCAxOTAgMTM3LjkwOSAxOTAgMTYwQzE5MCAyMDQuMTgzIDE3Mi4wOTEgMjQwIDE1MCAyNDBDMTI3LjkwOSAyNDAgMTEwIDIwNC4xODMgMTEwIDE2MEMxMTAgMTM3LjkwOSAxMjcuOTA5IDEyMCAxNTAgMTIwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-pink-50 transition-colors">
                    <Heart className="w-5 h-5 text-pink-400" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pet.category === '猫' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {pet.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                  <span className="text-2xl font-bold text-orange-500">¥{pet.price}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">品种：</span>
                    <span className="text-gray-800 font-medium">{pet.breed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">年龄：</span>
                    <span className="text-gray-800 font-medium">{pet.age}岁</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">性别：</span>
                    <span className="text-gray-800 font-medium">{pet.gender}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{pet.description}</p>
                
                <button
                  onClick={scrollToContact}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>联系我们</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无符合条件的宠物</h3>
            <p className="text-gray-500">请尝试调整筛选条件</p>
          </div>
        )}
      </div>
    </div>
  );
}