'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  Target,
  Users,
  Trophy,
  CheckCircle2,
  HelpCircle,
  MessageCircle
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-blue-600 flex items-center">
              <svg
                className="w-8 h-8 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              NotLab
            </div>
            <div className="hidden md:flex space-x-6">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <Target className="w-4 h-4" />
                Özellikler
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                Fiyatlandırma
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                SSS
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                İletişim
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-full"
              asChild
            >
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200/50 transition-all duration-200 rounded-full"
              asChild
            >
              <Link href="/register">Ücretsiz Başla</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section - daha canlı ve dinamik */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        {/* Animasyonlu arka plan */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Dekoratif şekiller */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
          </motion.div>
        </div>

        <div className="container mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-white/80 backdrop-blur-sm shadow-lg rounded-full p-1 mb-6"
            >
              <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                🚀 Eğitimde Yeni Nesil Platform
              </span>
            </motion.div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-gray-900">Eğitimde</span>{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dijital Dönüşümün
                </span>
                <motion.span
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute bottom-2 left-0 h-3 bg-blue-100 opacity-50 z-0"
                />
              </span>
              <br />
              <span className="mt-4 inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Öncü Platformu
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
            >
              Kişiselleştirilmiş öğrenme deneyimi, interaktif içerikler ve yapay zeka destekli eğitim sistemiyle geleceğin eğitimini bugünden yaşayın.
            </motion.p>

            {/* Özellik kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16 mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-50 to-white backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100/50"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2">Kişiselleştirilmiş</h3>
                  <p className="text-gray-600 text-sm">
                    Size özel öğrenme deneyimi
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-50 to-white backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100/50"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2">Yapay Zeka</h3>
                  <p className="text-gray-600 text-sm">
                    Akıllı öğrenme asistanı
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-pink-50 to-white backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100/50"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2">İnteraktif</h3>
                  <p className="text-gray-600 text-sm">
                    Etkileşimli içerikler
                  </p>
                </div>
              </motion.div>
            </div>

            {/* CTA Butonları */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-200/50 transition-all duration-200 text-lg px-8 py-6 h-auto rounded-full group"
                asChild
              >
                <Link href="/register" className="flex items-center">
                  Hemen Başla
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200 text-lg px-8 py-6 h-auto rounded-full group backdrop-blur-sm"
                asChild
              >
                <Link href="#features" className="flex items-center">
                  Keşfet
                  <motion.span
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.1, 1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-2"
                  >
                    👋
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white relative overflow-hidden">
        {/* Dekoratif arka plan elementleri */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white">
          <div className="absolute top-40 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
          <div className="absolute bottom-40 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
            {/* Sol taraf - Başlık ve Açıklama */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 text-left"
            >
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-6 py-2 rounded-full shadow-sm mb-6"
              >
                ✨ Neden Biz?
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-gray-900">Neden</span>{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-gray-900">
                    NotLab
                  </span>
                  <motion.span
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute bottom-2 left-0 h-3 bg-gradient-to-r from-blue-100 to-purple-100 opacity-50 z-0"
                  />
                </span>
                <span className="text-gray-900">?</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Modern eğitim araçları ve yenilikçi yaklaşımlarla öğrenme deneyiminizi
                <span className="text-blue-600 font-medium"> en üst seviyeye </span>
                çıkarın.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Kişiselleştirilmiş Eğitim</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-medium">7/24 Destek</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-pink-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Sürekli Güncellenen İçerik</span>
                </div>
              </div>
            </motion.div>

            {/* Sağ taraf - İstatistikler */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 grid grid-cols-2 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:border-blue-100 transition-all duration-300"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">
                    {stat.title}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Özellik kartları - grid yapısı */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Dekoratif arka plan gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-blue-600 w-6 h-6">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white relative overflow-hidden">
        {/* Dekoratif arka plan */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-6 py-2 rounded-full shadow-sm"
            >
              🤔 Sıkça Sorulan Sorular
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
              <span className="text-gray-900">Aklınızdaki</span>{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tüm Sorular
                </span>
                <motion.span
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute bottom-2 left-0 h-3 bg-gradient-to-r from-blue-100 to-purple-100 opacity-50 z-0"
                />
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
              NotLab hakkında merak ettiğiniz tüm soruların cevapları burada
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="group bg-white border border-gray-200 rounded-2xl data-[state=open]:bg-gradient-to-r data-[state=open]:from-blue-50/50 data-[state=open]:to-purple-50/50 data-[state=open]:border-blue-200 transition-all duration-300"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline group-data-[state=open]:text-blue-600">
                      <div className="flex items-center text-left">
                        <motion.div
                          initial={{ rotate: 0 }}
                          whileHover={{ rotate: 15 }}
                          transition={{ duration: 0.2 }}
                          className="mr-4 text-xl opacity-70 group-data-[state=open]:opacity-100"
                        >
                          💭
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-900 group-data-[state=open]:text-blue-600 transition-colors">
                          {faq.question}
                        </h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="pl-12 border-l-2 border-blue-100">
                          <p className="text-gray-600">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>

          {/* Alt CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-6">
              Başka sorularınız mı var?
            </p>
            <Button
              variant="outline"
              className="rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              asChild
            >
              <Link href="/contact">
                Bize Ulaşın <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50 rounded-t-[3rem] rounded-b-[3rem]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full">
              Rakamlarla NotLab
            </span>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
              >
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-lg text-gray-600 font-medium group-hover:text-blue-600 transition-colors">
                    {stat.title}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-6 py-2 rounded-full shadow-sm"
            >
              💎 Fiyatlandırma
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
              <span className="text-gray-900">Size Uygun</span>{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Plan
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              İhtiyaçlarınıza en uygun planı seçin ve hemen öğrenmeye başlayın
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Ücretsiz Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-sm font-semibold px-4 py-1 rounded-bl-2xl rounded-tr-3xl">
                Ücretsiz
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Başlangıç</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-gray-900">₺0</span>
                <span className="text-gray-600 ml-2">/ aylık</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Temel dersler ve içerikler
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Sınırlı ödev takibi
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Topluluk desteği
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Mobil uygulama erişimi
                </li>
              </ul>
              <Button
                className="w-full rounded-full bg-gray-900 hover:bg-gray-800 text-white"
                size="lg"
                asChild
              >
                <Link href="/register">Ücretsiz Başla</Link>
              </Button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-bl-2xl rounded-tr-3xl">
                Premium
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro Üyelik</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">₺99</span>
                <span className="text-gray-600 ml-2">/ aylık</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                  Tüm ücretsiz özellikleri içerir
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                  Sınırsız ders ve içerik erişimi
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                  Yapay zeka destekli öğrenme asistanı
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                  Kişiselleştirilmiş öğrenme planı
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                  7/24 öncelikli destek
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                  Offline erişim
                </li>
              </ul>
              <Button
                className="w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                size="lg"
                asChild
              >
                <Link href="/register">Pro'ya Yükselt</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white rounded-t-[3rem]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
          >


            {/* Mobil Uygulama Butonları */}
            <div className="mt-2 pt-2 ">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="https://play.google.com/store"
                  target="_blank"
                  className="inline-block transition-transform hover:scale-105"
                >
                  <img
                    src="/google-play-badge.png"
                    alt="Get it on Google Play"
                    className="h-16 w-auto"
                  />
                </Link>
                <Link
                  href="https://apps.apple.com"
                  target="_blank"
                  className="inline-block transition-transform hover:scale-105"
                >
                  <img
                    src="/app-store-badge.svg"
                    alt="Download on the App Store"
                    className="h-[45px] w-auto"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - aynı kalabilir, sadece renkleri güncelleyelim */}
      <footer className="border-t py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Birinci Sütun */}
            <div className="space-y-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NotLab
              </div>
              <p className="text-gray-600">
                Eğitimde dijital dönüşümün öncüsü. Geleceğin eğitim platformu.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 p-3 rounded-full transition-all duration-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 p-3 rounded-full transition-all duration-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 p-3 rounded-full transition-all duration-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.016 18.6h-2.472v-3.9c0-.923-.018-2.108-1.284-2.108-1.285 0-1.482 1.003-1.482 2.04v3.968H9.306V9.6h2.372v1.088h.033c.33-.624 1.137-1.284 2.34-1.284 2.505 0 2.967 1.65 2.967 3.794v4.8zM7.836 8.512a1.44 1.44 0 01-1.435-1.435A1.44 1.44 0 017.836 5.64a1.44 1.44 0 011.435 1.437 1.44 1.44 0 01-1.435 1.435zm1.235 10.088H6.6V9.6h2.471v9z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* İkinci Sütun */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Özellikler</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Dijital Müfredat</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Kişisel Gelişim</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Grup Çalışması</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Başarı Sistemi</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Geri Bildirim</a></li>
              </ul>
            </div>

            {/* Üçüncü Sütun */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Destek</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Yardım Merkezi</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">SSS</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">İletişim</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Kullanım Şartları</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Gizlilik Politikası</a></li>
              </ul>
            </div>

            {/* Dördüncü Sütun */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">İletişim</h3>
              <ul className="space-y-2">
                <li className="text-gray-600">
                  <span className="block">Email:</span>
                  info@notlab.com
                </li>
                <li className="text-gray-600">
                  <span className="block">Telefon:</span>
                  +90 (212) 123 45 67
                </li>
                <li className="text-gray-600">
                  <span className="block">Adres:</span>
                  Levent, İstanbul
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-gray-600">
            <p>&copy; 2024 NotLab. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "Dijital Müfredat",
    description: "Modern eğitim içerikleri ve interaktif derslerle öğrenmeyi kolaylaştırın",
    icon: <BookOpen className="h-6 w-6 text-blue-600" />
  },
  {
    title: "Kişisel Gelişim",
    description: "Kendi hızınızda ilerleyin ve başarılarınızı takip edin",
    icon: <Target className="h-6 w-6 text-blue-600" />
  },
  {
    title: "Grup Çalışması",
    description: "Arkadaşlarınızla birlikte öğrenin ve bilgi paylaşın",
    icon: <Users className="h-6 w-6 text-blue-600" />
  },
  {
    title: "Başarı Sistemi",
    description: "Rozetler ve seviye atlama sistemiyle motivasyonunuzu artırın",
    icon: <Trophy className="h-6 w-6 text-blue-600" />
  },
  {
    title: "Anlık Geri Bildirim",
    description: "Performansınızı anlık olarak görün ve gelişim alanlarınızı keşfedin",
    icon: <CheckCircle2 className="h-6 w-6 text-blue-600" />
  }
]

const stats = [
  {
    value: "10K+",
    title: "Aktif Öğrenci"
  },
  {
    value: "500+",
    title: "Ders İçeriği"
  },
  {
    value: "95%",
    title: "Memnuniyet Oranı"
  }
]

const faqs = [
  {
    question: "NotLab'i nasıl kullanmaya başlayabilirim?",
    answer: "Ücretsiz bir hesap oluşturarak hemen başlayabilirsiniz. Kayıt olduktan sonra size özel bir öğrenme planı oluşturulacak ve derslere erişim sağlayabileceksiniz."
  },
  {
    question: "Hangi dersleri bulabilirim?",
    answer: "Platform üzerinde matematik, fen bilimleri, sosyal bilimler ve daha birçok alanda interaktif dersler bulunmaktadır. Sürekli güncellenen içeriklerle öğrenme deneyiminizi zenginleştiriyoruz."
  },
  {
    question: "Grup çalışmaları nasıl yapılıyor?",
    answer: "Platformumuzda sanal sınıflar oluşturabilir, arkadaşlarınızla çalışma grupları kurabilir ve ortak projeler üzerinde çalışabilirsiniz. Öğretmenleriniz de bu gruplara rehberlik edebilir."
  },
  {
    question: "Başarı sistemi nasıl çalışıyor?",
    answer: "Her tamamladığınız ders ve aktivite için puanlar kazanır, rozetler elde edersiniz. Seviye atladıkça yeni özellikler açılır ve başarılarınız profilinizde görüntülenir."
  },
  {
    question: "Mobil uygulama mevcut mu?",
    answer: "Evet, iOS ve Android için mobil uygulamamız mevcuttur. Mobil uygulama üzerinden tüm derslere erişebilir ve öğrenme deneyiminizi her yerde sürdürebilirsiniz."
  }
]
