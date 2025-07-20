import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, User, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category: string;
  features: string[];
}

interface OccupiedSlot {
  start_time: string;
  end_time: string;
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface Appointment {
  id: number;
  petName: string;
  packageId: number;
  startTime: string;
  endTime: string;
  notes: string;
  contactPhone: string;
}



const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let hour = 9; hour <= 18; hour++) {
    const start = `${hour.toString().padStart(2, '0')}:00`;
    const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
    
    // 模拟一些已被占用的时间段
    const isOccupied = Math.random() < 0.3;
    
    slots.push({
      start,
      end,
      available: !isOccupied
    });
  }
  
  return slots;
};

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [petName, setPetName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [occupiedSlots, setOccupiedSlots] = useState<OccupiedSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取套餐数据
  useEffect(() => {
    fetchPackages();
  }, []);

  // 当选择日期时获取已占用时间段
  useEffect(() => {
    if (selectedDate) {
      fetchOccupiedSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      const data = await response.json();
      if (data.success) {
        setPackages(data.data);
      } else {
        toast.error('获取套餐信息失败');
      }
    } catch (error) {
      console.error('获取套餐失败:', error);
      toast.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const fetchOccupiedSlots = async (date: string) => {
    try {
      const response = await fetch(`/api/appointments/occupied-slots?date=${date}`);
      const data = await response.json();
      if (data.success) {
        setOccupiedSlots(data.data);
      }
    } catch (error) {
      console.error('获取已占用时间段失败:', error);
    }
  };

  // 检查时间段是否被占用
  const isTimeSlotOccupied = (time: string) => {
    if (!selectedDate || !selectedPackage) return false;
    
    const selectedPkg = packages.find(pkg => pkg.id.toString() === selectedPackage);
    if (!selectedPkg) return false;
    
    const startTime = new Date(`${selectedDate}T${time}:00`);
    const endTime = new Date(startTime.getTime() + selectedPkg.duration_minutes * 60000);
    
    return occupiedSlots.some(slot => {
      const slotStart = new Date(slot.start_time);
      const slotEnd = new Date(slot.end_time);
      
      return (
        (startTime < slotEnd && endTime > slotStart) ||
        (startTime < slotStart && endTime > slotStart) ||
        (startTime >= slotStart && startTime < slotEnd)
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedPackage || !petName || !contactPhone) {
      toast.error('请填写所有必填信息');
      return;
    }
    
    if (isTimeSlotOccupied(selectedTime)) {
      toast.error('选择的时间段已被预约，请选择其他时间');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const selectedPkg = packages.find(pkg => pkg.id.toString() === selectedPackage);
      if (!selectedPkg) {
        toast.error('套餐信息错误');
        return;
      }
      
      const startTime = new Date(`${selectedDate}T${selectedTime}:00`);
      const endTime = new Date(startTime.getTime() + selectedPkg.duration_minutes * 60000);
      
      const appointmentData = {
        petName,
        packageId: parseInt(selectedPackage),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        notes,
        contactPhone
      };
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('预约提交成功！我们会尽快联系您确认。');
        
        // 重置表单
        setSelectedDate('');
        setSelectedTime('');
        setSelectedPackage('');
        setPetName('');
        setContactPhone('');
        setNotes('');
        
        // 重新获取已占用时间段
        if (selectedDate) {
          fetchOccupiedSlots(selectedDate);
        }
      } else {
        toast.error(data.message || '预约提交失败');
      }
    } catch (error) {
      console.error('预约提交失败:', error);
      toast.error('网络错误，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 生成可选时间段
  const timeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 18) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  const selectedPackageInfo = packages.find(pkg => pkg.id.toString() === selectedPackage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

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
            <div className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-600 hover:text-orange-500 transition-colors">首页</a>
              <a href="/booking" className="text-orange-500 font-medium">预约服务</a>
              <a href="/pets" className="text-gray-600 hover:text-orange-500 transition-colors">宠物商城</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">预约宠物洗护服务</h1>
          <p className="text-gray-600">为您的爱宠选择最适合的护理套餐</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左侧：套餐选择和时间选择 */}
          <div className="space-y-6">
            {/* 套餐选择 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                选择服务套餐
              </h2>
              <div className="space-y-3">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedPackage === pkg.id.toString()
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id.toString())}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{pkg.name}</h3>
                      <span className="text-orange-500 font-bold">¥{pkg.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">时长：{pkg.duration_minutes}分钟</p>
                    <p className="text-sm text-gray-500 mb-2">{pkg.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {pkg.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 日期选择 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                选择预约日期
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* 时间选择 */}
            {selectedDate && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-500" />
                  选择服务时间
                </h2>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                        isTimeSlotOccupied(time)
                          ? 'bg-red-100 text-red-500 cursor-not-allowed'
                          : selectedTime === time
                          ? 'bg-orange-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                      }`}
                      onClick={() => !isTimeSlotOccupied(time) && setSelectedTime(time)}
                      disabled={isTimeSlotOccupied(time)}
                    >
                      {time}
                      {isTimeSlotOccupied(time) && (
                        <AlertCircle className="w-4 h-4 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
                {selectedTime && selectedPackageInfo && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-blue-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        预约时间：{selectedTime} - {new Date(new Date(`${selectedDate}T${selectedTime}:00`).getTime() + selectedPackageInfo.duration_minutes * 60000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">时长：{selectedPackageInfo.duration_minutes}分钟</p>
                    <p className="text-sm text-gray-600">费用：¥{selectedPackageInfo.price}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 右侧：预约表单 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-orange-500" />
              填写预约信息
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  宠物昵称 *
                </label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="请输入宠物的昵称"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  联系电话 *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="请输入您的联系电话"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备注信息
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="请输入特殊需求或备注信息"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedDate || !selectedTime || !selectedPackage || !petName || !contactPhone}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                  isSubmitting || !selectedDate || !selectedTime || !selectedPackage || !petName || !contactPhone
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 transform hover:scale-105'
                }`}
              >
                {isSubmitting ? '提交中...' : '确认预约'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;