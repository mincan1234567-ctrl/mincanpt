'use client';

import React, { useState } from 'react';
import { Send, Globe, Image as ImageIcon, Video, FileText, Film, Edit3, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [heroInput, setHeroInput] = useState('');

  const features = [
    { title: "웹사이트 만들기", desc: "AI가 디자인부터 코딩까지 웹사이트를 만들어줍니다.", Icon: Globe },
    { title: "사진 만들기", desc: "상상하는 모든 이미지를 AI가 현실로 만들어줍니다.", Icon: ImageIcon },
    { title: "영상 만들기", desc: "텍스트만 입력하면 멋진 영상을 AI가 자동으로 제작합니다.", Icon: Video },
    { title: "PPT 만들기", desc: "주제를 입력하면 깔끔한 발표 자료를 만들어줍니다.", Icon: FileText },
    { title: "동영상 편집", desc: "자르기, 자막, 효과까지 쉽고 빠르게 편집합니다.", Icon: Film },
    { title: "사진 편집", desc: "배경 제거, 색감 보정 등 다양한 편집을 지원합니다.", Icon: Edit3 },
  ];

  return (
    <div className="min-h-screen bg-[#080a10] text-white flex flex-col items-center pt-12 px-4">
      <h1 className="text-4xl md:text-5xl font-black text-center mb-3">
        <span className="text-indigo-400">상상</span>을 입력하면, 작품이 됩니다.
      </h1>
      <p className="text-gray-400 text-sm mb-8 text-center">민찬피티는 아이디어를 완성해주는 AI 플랫폼입니다.</p>

      <div className="w-full max-w-2xl bg-[#181c28] border border-gray-700 rounded-2xl p-2 flex items-center mb-10">
        <input
          type="text"
          value={heroInput}
          onChange={(e) => setHeroInput(e.target.value)}
          placeholder="무엇이든 물어보세요. 예) 홈페이지 만들어줘"
          className="flex-1 bg-transparent px-4 text-sm outline-none text-white"
        />
        <button className="bg-indigo-600 p-2.5 rounded-xl">
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
        {features.map((item, idx) => {
          const IconComponent = item.Icon;
          return (
            <div key={idx} className="bg-[#131722] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 mb-4">{item.desc}</p>
              </div>
              <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-white">
                시작하기 <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
