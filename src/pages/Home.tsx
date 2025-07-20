import { useState, useEffect } from 'react';
import { Calendar, Star, Phone, MapPin, Heart, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  petName: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: '李小姐',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20asian%20woman%20smiling%20portrait%20warm%20lighting%20friendly%20expression&image_size=square',
    rating: 5,
    comment: '服务非常专业，小橘洗完澡后毛发特别柔顺，工作人员很有耐心！',
    petName: '小橘'
  },
  {
    id: 2,
    name: '王先生',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20asian%20man%20smiling%20portrait%20casual%20style%20warm%20lighting&image_size=square',
    rating: 5,
    comment: '环境很干净，价格合理，豆豆每次来都很开心，强烈推荐！',
    petName: '豆豆'
  },
  {
    id: 3,
    name: '张女士',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20middle%20aged%20woman%20smiling%20portrait%20kind%20expression%20soft%20lighting&image_size=square',
    rating: 5,
    comment: '技师手法很轻柔，雪球第一次洗澡都没有害怕，服务态度超级好！',
    petName: '雪球'
  }
];

export default function Home() {
  const [currentReview, setCurrentReview] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      nextReview();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentReview]);

  const nextReview = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevReview = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
      setIsAnimating(false);
    }, 300);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* 导航栏 */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-orange-100 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐾</span>
              </div>
              <span className="text-xl font-bold text-gray-800">萌宠小屋</span>
            </div>
            <div className="flex space-x-6">
              <a href="/" className="text-orange-500 font-medium">首页</a>
              <a href="/booking" className="text-gray-600 hover:text-orange-500 transition-colors">预约服务</a>
              <a href="/pets" className="text-gray-600 hover:text-orange-500 transition-colors">宠物商城</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Banner区块 */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cats%20and%20dogs%20getting%20groomed%20in%20professional%20pet%20salon%20warm%20lighting%20happy%20pets%20cozy%20atmosphere&image_size=landscape_16_9"
            alt="宠物洗护"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGF5aWRHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY4QzQyO3N0b3Atb3BhY2l0eTowLjgiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZCNkMxO3N0b3Atb3BhY2l0eTowLjgiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-pink-500/30"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-bounce-slow">
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                萌宠小屋
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-300">
              给您的爱宠最温柔的呵护 ✨
            </p>
            <div className="flex items-center justify-center space-x-2 text-lg animate-fade-in-up animation-delay-600">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              <span>专业洗护 · 贴心服务 · 健康快乐</span>
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* 快速入口 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">快速预约服务</h2>
          <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">专业宠物洗护服务</h3>
                <p className="text-gray-600">基础洗护 · 精致美容 · 豪华SPA</p>
                <p className="text-sm text-orange-500 mt-2">现在预约享受9折优惠！</p>
              </div>
              <div className="flex-shrink-0">
                <a href="/booking">
                  <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:from-orange-600 hover:to-pink-600 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2">
                    <Calendar className="w-6 h-6" />
                    <span>立即预约</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 用户口碑 */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">客户好评</h2>
          
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-xl p-8 mx-4">
              <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                  <div className="flex-shrink-0">
                    <img
                      src={reviews[currentReview].avatar}
                      alt={reviews[currentReview].name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-orange-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzMiIgcj0iMTIiIGZpbGw9IiNEOUQ5RDkiLz4KPHBhdGggZD0iTTIwIDY4QzIwIDU2IDI4IDQ4IDQwIDQ4QzUyIDQ4IDYwIDU2IDYwIDY4IiBmaWxsPSIjRDlEOUQ5Ii8+Cjwvc3ZnPgo=';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < reviews[currentReview].rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 text-lg mb-4 italic">
                      "{reviews[currentReview].comment}"
                    </p>
                    
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{reviews[currentReview].name}</span>
                      <span className="mx-2">·</span>
                      <span>宠物：{reviews[currentReview].petName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 导航按钮 */}
            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
            
            {/* 指示器 */}
            <div className="flex justify-center mt-6 space-x-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentReview ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section id="contact" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">联系我们</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* 地图区域 */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center">
                <img
                  src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20pet%20store%20location%20map%20with%20colorful%20markers%20and%20friendly%20neighborhood%20illustration%20style&image_size=landscape_4_3"
                  alt="店铺位置"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.innerHTML = '<div class="flex items-center justify-center h-full"><MapPin class="w-16 h-16 text-orange-400" /></div>';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 text-orange-500 mr-2" />
                  店铺地址
                </h3>
                <p className="text-gray-600 mb-2">上海市浦东新区萌宠街123号</p>
                <p className="text-sm text-gray-500">营业时间：9:00 - 19:00（周一至周日）</p>
              </div>
            </div>
            
            {/* 联系信息 */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Phone className="w-5 h-5 text-orange-500 mr-2" />
                联系方式
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">客服热线</p>
                    <p className="text-2xl font-bold text-orange-500">400-888-6666</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">微信客服</p>
                    <p className="text-lg text-gray-600">mengchong123</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-600 mb-2">💝 首次到店享受8折优惠</p>
                  <p className="text-sm text-gray-600">🎉 推荐朋友再享额外优惠</p>
                </div>
                
                <button
                  onClick={() => window.location.href = '/booking'}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-medium hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105"
                >
                  立即预约服务
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🐾</span>
            </div>
            <span className="text-xl font-bold">萌宠小屋</span>
          </div>
          <p className="text-gray-400 mb-4">专业宠物洗护服务 · 让每只宠物都闪闪发光</p>
          <p className="text-sm text-gray-500">
            © 2024 萌宠小屋. 保留所有权利.
          </p>
        </div>
      </footer>
    </div>
  );
}