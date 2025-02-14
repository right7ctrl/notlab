'use client'

import { useEffect, useState, use } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Book, FileQuestion, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { checkAchievements } from '@/lib/achievements'

type Topic = {
    id: string
    name: string
    content: string
    unit_id: string
    order_number: number
    units?: {
        id: string
        name: string
        subject_id: string
        subjects?: {
            id: string
            name: string
        }
    }
    quizzes?: Quiz[]
}

type Quiz = {
    id: string
    title: string
    description: string
    topic_id: string
    created_at: string
    updated_at: string
    grade_id: string
    subject_id: string
    unit_id: string
}

type Question = {
    id: string
    title: string
    content: string
    subject_id: string
    unit_id: string
    topic_id: string
    options: any[] // jsonb tipinde
    created_at: string
    updated_at: string
}

type QuizOption = {
    label: string
    content: string
    is_correct: boolean
}

type FormattedQuizQuestion = {
    id: string
    quiz_id: string
    question: string
    content: string
    options: QuizOption[]
    order_index: number
}

type QuizQuestion = {
    id: string
    quiz_id: string
    question_id: string
    order_index: number
    created_at: string
    question?: Question
}

type ActiveContent = {
    type: 'topic' | 'quiz'
    id: string
}

type Progress = {
    subjects: {
        [subject_id: string]: {
            units: {
                [unit_id: string]: {
                    topics: {
                        [topic_id: string]: {
                            is_read: boolean;
                            is_completed: boolean;
                            completed_at?: string;
                            last_read_at: string;
                            correct_answers?: number;
                            total_questions?: number;
                            completed_quizzes?: string[];
                        }
                    };
                    completed_topics: number;
                    total_topics: number;
                }
            };
        }
    };
    last_activity: string | null;
}

export default function TopicDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [topic, setTopic] = useState<Topic | null>(null)
    const [unitTopics, setUnitTopics] = useState<Topic[]>([])
    const [unitQuizzes, setUnitQuizzes] = useState<Quiz[]>([])
    const [nextTopic, setNextTopic] = useState<Topic | null>(null)
    const supabase = createClientComponentClient()
    const router = useRouter()
    const [activeContent, setActiveContent] = useState<ActiveContent>({ type: 'topic', id: '' })
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
    const [quizQuestions, setQuizQuestions] = useState<FormattedQuizQuestion[]>([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
    const [showResults, setShowResults] = useState(false)
    const [progress, setProgress] = useState<{
        is_read: boolean;
        is_completed: boolean;
    }>({
        is_read: false,
        is_completed: false
    });

    useEffect(() => {
        // Auth state değişikliklerini dinle
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                // Tüm session bilgilerini localStorage'a kaydet
                localStorage.setItem('session', JSON.stringify(session))
            } else {
                // Session silindiğinde localStorage'dan kaldır
                localStorage.removeItem('session')
            }
        })

        // İlk yüklemede mevcut session'ı kontrol et
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                localStorage.setItem('session', JSON.stringify(session))
            }
        }
        getInitialSession()

        // Cleanup
        return () => {
            subscription.unsubscribe()
        }
    }, []) // Sadece component mount olduğunda çalışsın

    useEffect(() => {
        loadTopicAndUnit()
    }, [resolvedParams.id])

    const loadTopicAndUnit = async () => {
        // Mevcut konuyu yükle
        const { data: topicData } = await supabase
            .from('topics')
            .select(`
                *,
                units (
                    id,
                    name,
                    subject_id,
                    subjects (
                        id,
                        name
                    )
                )
            `)
            .eq('id', resolvedParams.id)
            .single()

        if (topicData) {
            // Debug için topic ID'yi yazdır
            console.log('Current Topic ID:', topicData.id)

            // Konuya ait quizleri yükle
            const { data: quizData, error: quizError } = await supabase
                .from('quizzes')
                .select('id, title, description, topic_id, created_at, updated_at')
                .eq('topic_id', topicData.id)
                .order('created_at', { ascending: true })

            // Debug için quiz verilerini ve varsa hatayı yazdır
            console.log('Quiz Data:', quizData)
            console.log('Quiz Error:', quizError)

            setTopic({
                ...topicData,
                quizzes: quizData || []
            })

            // Ünitedeki diğer konuları yükle
            const { data: topicsData } = await supabase
                .from('topics')
                .select('*')
                .eq('unit_id', topicData.unit_id)
                .order('order_number', { ascending: true })

            if (topicsData) {
                const topicsWithQuizzes = await Promise.all(
                    topicsData.map(async (topic) => {
                        const { data: quizzes, error } = await supabase
                            .from('quizzes')
                            .select('id, title, description, topic_id, created_at, updated_at')
                            .eq('topic_id', topic.id)
                            .order('created_at', { ascending: true })

                        console.log(`Quizzes for topic ${topic.id}:`, quizzes)
                        console.log(`Error for topic ${topic.id}:`, error)

                        return {
                            ...topic,
                            quizzes: quizzes || []
                        }
                    })
                )

                setUnitTopics(topicsWithQuizzes)

                // Sonraki konuyu bul
                const currentIndex = topicsData.findIndex(t => t.id === topicData.id)
                if (currentIndex < topicsData.length - 1) {
                    setNextTopic(topicsData[currentIndex + 1])
                }
            }
        }
    }

    // Quiz'e tıklandığında çağrılacak fonksiyon
    const handleQuizClick = async (quiz: Quiz) => {
        // State'leri sıfırla
        setShowResults(false)
        setUserAnswers({})
        setCurrentQuestionIndex(0)

        // Yeni quiz'i ayarla
        setActiveContent({ type: 'quiz', id: quiz.id })
        setActiveQuiz(quiz)

        // Quiz sorularını yükle
        const { data: quizQuestionsData } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('quiz_id', quiz.id)
            .order('order_index', { ascending: true })

        if (quizQuestionsData) {
            const questionIds = quizQuestionsData.map(qq => qq.question_id)

            const { data: questionsData } = await supabase
                .from('questions')
                .select('id, title, content, options')
                .in('id', questionIds)

            const formattedQuestions = quizQuestionsData.map(qq => {
                const questionData = questionsData?.find(q => q.id === qq.question_id)
                return {
                    id: qq.id,
                    quiz_id: qq.quiz_id,
                    question: questionData?.title || '',
                    content: questionData?.content || '',
                    options: questionData?.options || [],
                    order_index: qq.order_index
                }
            })

            setQuizQuestions(formattedQuestions)
        }
    }

    // Quiz'i tamamla
    const handleQuizSubmit = async () => {
        setShowResults(true)

        try {
            const session = JSON.parse(localStorage.getItem('session') || '{}')
            const user = session?.user
            const grade_id = session?.user?.grade_id

            if (!user?.id || !activeQuiz?.id) {
                throw new Error('Kullanıcı veya quiz bilgisi bulunamadı')
            }

            // Quiz sonucunu hesapla
            const score = quizQuestions.reduce((acc, question) => {
                const userAnswer = userAnswers[question.id]
                const selectedOption = question.options.find(opt => opt.label === userAnswer)
                return acc + (selectedOption?.is_correct ? 1 : 0)
            }, 0)

            // Mevcut istatistikleri kontrol et
            const { data: stats, error: fetchError } = await supabase
                .from('user_quiz_statistics')
                .select('*')
                .eq('user_id', user.id)
                .eq('quiz_id', activeQuiz.id)

            if (stats && stats.length > 0) {
                // Mevcut istatistikleri güncelle
                const existingStats = stats[0]
                const newTotalAttempts = existingStats.total_attempts + 1
                const newTotalCorrect = existingStats.correct_answers + score

                const { data: updateResult, error: updateError } = await supabase
                    .from('user_quiz_statistics')
                    .update({
                        total_attempts: newTotalAttempts,
                        correct_answers: newTotalCorrect,
                        total_questions: quizQuestions.length,
                        last_attempt_at: new Date().toISOString()
                    })
                    .eq('id', existingStats.id)
                    .select()

                console.log('Update Result:', updateResult)
                console.log('Update Error:', updateError)
            } else {
                // Yeni kayıt oluştur
                const { data: insertResult, error: insertError } = await supabase
                    .from('user_quiz_statistics')
                    .insert({
                        user_id: user.id,
                        quiz_id: activeQuiz.id,
                        topic_id: topic?.id,
                        unit_id: topic?.unit_id,
                        subject_id: topic?.units?.subject_id,
                        grade_id: grade_id,
                        total_attempts: 1,
                        correct_answers: score,
                        total_questions: quizQuestions.length,
                        last_attempt_at: new Date().toISOString()
                    })
                    .select()

                console.log('Insert Result:', insertResult)
                console.log('Insert Error:', insertError)
            }

            // Quiz başarıyla tamamlandıysa progress'i güncelle
            await updateProgress(true, true);

            // Başarı oranını göster
            const successRate = Math.round((score / quizQuestions.length) * 100)
            alert(`Quiz tamamlandı!\nSkorunuz: ${score}/${quizQuestions.length}\nBaşarı Oranı: %${successRate}`)

            // Quiz tamamlandıktan sonra progress'i tekrar yükle
            await loadProgress();

            // Quiz tamamlandıktan 2 saniye sonra sonuçları gizle
            setTimeout(() => {
                setShowResults(false)
            }, 2000)

            // Başarımları kontrol et
            await checkAchievements(user.id, 'quiz_completed')
            await checkAchievements(user.id, 'question_solved', quizQuestions.length)

        } catch (error) {
            console.error('Quiz istatistikleri güncellenirken hata oluştu:', error)
            alert('Quiz sonucu kaydedilirken bir hata oluştu.')
        }
    }

    // Cevap seçildiğinde
    const handleAnswerSelect = (questionId: string, answer: string) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }))
    }

    // Progress'i yükle
    const loadProgress = async () => {
        if (!topic?.id || !topic.units?.subject_id) return;

        const session = JSON.parse(localStorage.getItem('session') || '{}')
        const user = session?.user

        if (!user?.id) return;

        // Progress bilgisini profiles tablosundan al
        const { data: profile } = await supabase
            .from('profiles')
            .select('progress')
            .eq('id', user.id)
            .single();

        // Topic progress bilgisini JSONB'den çek
        const topicProgress = profile?.progress?.subjects?.[topic.units.subject_id]
            ?.units?.[topic.unit_id]?.topics?.[topic.id];

        if (topicProgress) {
            setProgress({
                is_read: topicProgress.is_read,
                is_completed: topicProgress.is_completed
            });
        } else {
            setProgress({
                is_read: false,
                is_completed: false
            });
        }
    };

    // Progress'i güncelle
    const updateProgress = async (isRead: boolean = false, isCompleted: boolean = false) => {
        const session = JSON.parse(localStorage.getItem('session') || '{}')
        const user = session?.user

        if (!user?.id || !topic?.id || !topic.units?.subject_id) return;

        // Önce mevcut progress'i al
        const { data: profile } = await supabase
            .from('profiles')
            .select('progress')
            .eq('id', user.id)
            .single();

        // Mevcut topic progress'ini al
        const currentTopicProgress = profile?.progress?.subjects?.[topic.units.subject_id]
            ?.units?.[topic.unit_id]?.topics?.[topic.id] || {
            is_read: false,
            is_completed: false,
            completed_quizzes: []
        };

        // Quiz tamamlandıysa quiz ID'sini kaydet
        if (isCompleted && activeQuiz) {
            currentTopicProgress.completed_quizzes = [
                ...(currentTopicProgress.completed_quizzes || []),
                activeQuiz.id
            ];
        }

        // Konunun tamamen tamamlanıp tamamlanmadığını kontrol et
        const hasQuizzes = topic.quizzes && topic.quizzes.length > 0;
        const allQuizzesCompleted = hasQuizzes ?
            topic.quizzes.every(quiz =>
                currentTopicProgress.completed_quizzes?.includes(quiz.id)
            ) : true;

        // Konunun tamamlanma durumunu belirle
        const isTopicCompleted = isRead && (!hasQuizzes || allQuizzesCompleted);

        const currentProgress = profile?.progress || {
            subjects: {},
            last_activity: null
        };

        // Debug logları
        console.log('Current Topic Progress:', currentTopicProgress);
        console.log('Has Quizzes:', hasQuizzes);
        console.log('Topic Quizzes:', topic.quizzes);
        console.log('Completed Quizzes:', currentTopicProgress.completed_quizzes);
        console.log('All Quizzes Completed:', allQuizzesCompleted);
        console.log('Is Topic Completed:', isTopicCompleted);

        const newProgress = {
            ...currentProgress,
            subjects: {
                ...currentProgress.subjects,
                [topic.units.subject_id]: {
                    ...currentProgress.subjects?.[topic.units.subject_id],
                    units: {
                        ...currentProgress.subjects?.[topic.units.subject_id]?.units,
                        [topic.unit_id]: {
                            ...currentProgress.subjects?.[topic.units.subject_id]?.units?.[topic.unit_id],
                            topics: {
                                ...currentProgress.subjects?.[topic.units.subject_id]?.units?.[topic.unit_id]?.topics,
                                [topic.id]: {
                                    is_read: isRead,
                                    is_completed: isTopicCompleted,
                                    completed_at: isTopicCompleted ? new Date().toISOString() : undefined,
                                    last_read_at: new Date().toISOString(),
                                    completed_quizzes: currentTopicProgress.completed_quizzes || []
                                }
                            },
                            completed_topics: Object.values(currentProgress.subjects?.[topic.units.subject_id]?.units?.[topic.unit_id]?.topics || {})
                                .filter(t => t.is_completed).length + (isTopicCompleted ? 1 : 0),
                            total_topics: unitTopics.length
                        }
                    }
                }
            },
            last_activity: new Date().toISOString()
        };

        // Debug log
        console.log('New Progress:', newProgress);

        // Progress'i güncelle
        const { data, error } = await supabase
            .from('profiles')
            .update({
                progress: newProgress
            })
            .eq('id', user.id);

        // Debug log
        if (error) {
            console.error('Progress Update Error:', error);
        }

        // State'i güncelle
        setProgress({
            is_read: isRead,
            is_completed: isTopicCompleted
        });
    };

    // Konu içeriği görüntülendiğinde
    useEffect(() => {
        if (topic?.id) {
            loadProgress();
            // Konuyu okundu olarak işaretle ve quiz yoksa tamamlandı olarak işaretle
            const hasQuiz = topic.quizzes && topic.quizzes.length > 0;
            updateProgress(true, !hasQuiz); // Quiz yoksa direkt tamamlandı olarak işaretle

            // Başarımları kontrol et
            const session = JSON.parse(localStorage.getItem('session') || '{}')
            if (session?.user?.id) {
                checkAchievements(session.user.id, 'topic_read')
            }
        }
    }, [topic?.id]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="border-b bg-white">
                <div className="px-4 sm:px-6 lg:px-12">
                    <nav className="flex items-center gap-2 py-4 text-sm">
                        <Link href="/student" className="text-gray-500 hover:text-gray-900">
                            Anasayfa
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                        <Link href="/student" className="text-gray-500 hover:text-gray-900">
                            6.Sınıf
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                        <Link
                            href={`/student/subjects/${topic?.units?.subject_id}`}
                            className="text-gray-500 hover:text-gray-900"
                        >
                            {topic?.units?.subjects?.name}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                        <Link
                            href={`/student/units/${topic?.unit_id}`}
                            className="text-gray-500 hover:text-gray-900"
                        >
                            {topic?.units?.name}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900 font-medium">{topic?.name}</span>
                    </nav>
                </div>
            </div>

            {/* İki Kolonlu İçerik */}
            <div className="px-4 sm:px-6 lg:px-12 py-8">
                <div className="flex gap-8">
                    {/* Sol Kolon - Konular ve Quizler Listesi */}
                    <div className="w-80 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h2 className="font-medium text-gray-900 mb-4">İçerik</h2>
                            <div className="space-y-1">
                                {unitTopics.map((t, index) => (
                                    <div key={`topic-${t.id}`} className="relative">
                                        {/* Dikey çizgi */}
                                        {index < unitTopics.length - 1 && (
                                            <div className="absolute left-4 top-10 bottom-0 w-px bg-gray-200" />
                                        )}

                                        {/* Konu */}
                                        <div className="relative">
                                            <Link href={`/student/topics/${t.id}`}>
                                                <div className={`
                                                    flex items-center gap-2 p-3 rounded-lg cursor-pointer
                                                    ${t.id === topic?.id
                                                        ? 'bg-blue-50 text-blue-600'
                                                        : 'hover:bg-gray-50 text-gray-600'
                                                    }
                                                `}>
                                                    <div className="relative">
                                                        <Book className="w-4 h-4 flex-shrink-0" />
                                                        {/* Yatay çizgi */}
                                                        {t.quizzes && t.quizzes.length > 0 && (
                                                            <div className="absolute left-2 top-4 h-px w-2 bg-gray-200" />
                                                        )}
                                                    </div>
                                                    <div className="text-sm font-medium">{t.name}</div>
                                                </div>
                                            </Link>

                                            {/* Konuya ait quizler */}
                                            {t.quizzes && t.quizzes.length > 0 && (
                                                <div className="ml-4 pl-4 border-l border-gray-200">
                                                    {t.quizzes.map((quiz, qIndex) => (
                                                        <button
                                                            key={`quiz-${quiz.id}`}
                                                            onClick={() => handleQuizClick(quiz)}
                                                            className={`
                                                                relative flex items-center gap-2 p-3 rounded-lg cursor-pointer w-full text-left
                                                                ${activeContent.type === 'quiz' && activeContent.id === quiz.id
                                                                    ? 'bg-purple-50 text-purple-600'
                                                                    : 'hover:bg-gray-50 text-gray-600'
                                                                }
                                                            `}
                                                        >
                                                            <div className="absolute -left-4 top-1/2 h-px w-4 bg-gray-200" />
                                                            <FileQuestion className="w-4 h-4 flex-shrink-0 text-purple-600" />
                                                            <div className="text-sm font-medium">{quiz.title}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sağ Kolon - Konu İçeriği veya Quiz */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            {activeContent.type === 'topic' ? (
                                // Konu İçeriği
                                <>
                                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">{topic?.name}</h1>
                                    <div
                                        className="prose prose-blue max-w-none"
                                        dangerouslySetInnerHTML={{ __html: topic?.content || '' }}
                                    />
                                    {/* Sonraki Konu Butonu */}
                                    {nextTopic && (
                                        <div className="mt-8 flex justify-end">
                                            <Link href={`/student/topics/${nextTopic.id}`}>
                                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                    Sonraki Konu
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 mb-4">
                                        {progress.is_read && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Okundu
                                            </span>
                                        )}
                                        {progress.is_completed && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Tamamlandı
                                            </span>
                                        )}
                                    </div>
                                </>
                            ) : (
                                // Quiz İçeriği
                                <div className="space-y-8">
                                    {/* Quiz Başlığı ve Geri Dönüş */}
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            <h1 className="text-2xl font-semibold text-gray-900">{activeQuiz?.title}</h1>
                                            <p className="text-gray-500 mt-1">{activeQuiz?.description}</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveContent({ type: 'topic', id: topic?.id || '' })}
                                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
                                        >
                                            <ChevronRight className="w-4 h-4 rotate-180" />
                                            Konu İçeriğine Dön
                                        </button>
                                    </div>

                                    {quizQuestions[currentQuestionIndex] && (
                                        <div className="space-y-6">
                                            {/* İlerleme Çubuğu */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-sm text-gray-500">
                                                    <span className="font-medium">Soru {currentQuestionIndex + 1} / {quizQuestions.length}</span>
                                                    <span>{Math.round((currentQuestionIndex + 1) / quizQuestions.length * 100)}% Tamamlandı</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-purple-500 rounded-full transition-all duration-300"
                                                        style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Soru İçeriği */}
                                            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <span className="text-purple-600 font-medium">{currentQuestionIndex + 1}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            {quizQuestions[currentQuestionIndex].question}
                                                        </h3>
                                                        {quizQuestions[currentQuestionIndex].content && (
                                                            <p className="text-gray-600 mt-2">
                                                                {quizQuestions[currentQuestionIndex].content}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Seçenekler */}
                                                <div className="grid gap-3 mt-6">
                                                    {quizQuestions[currentQuestionIndex].options.map((option, index) => {
                                                        const isSelected = userAnswers[quizQuestions[currentQuestionIndex].id] === option.label
                                                        const showResultStyles = showResults && {
                                                            correct: option.is_correct,
                                                            selected: isSelected,
                                                            wrong: isSelected && !option.is_correct
                                                        }

                                                        return (
                                                            <button
                                                                key={index}
                                                                onClick={() => !showResults && handleAnswerSelect(quizQuestions[currentQuestionIndex].id, option.label)}
                                                                disabled={showResults}
                                                                className={`
                                                                    w-full p-4 text-left rounded-xl border-2 transition-all relative
                                                                    ${showResults
                                                                        ? option.is_correct
                                                                            ? 'border-green-500 bg-green-50 text-green-900'
                                                                            : isSelected
                                                                                ? 'border-red-500 bg-red-50 text-red-900'
                                                                                : 'border-gray-200 bg-white opacity-60'
                                                                        : isSelected
                                                                            ? 'border-purple-500 bg-purple-50 text-purple-900 ring-2 ring-purple-200'
                                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                    }
                                                            `}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className={`
                                                                        w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                                                        ${showResults
                                                                            ? option.is_correct
                                                                                ? 'border-green-500 bg-green-500'
                                                                                : isSelected
                                                                                    ? 'border-red-500 bg-red-500'
                                                                                    : 'border-gray-300'
                                                                            : isSelected
                                                                                ? 'border-purple-500 bg-purple-500'
                                                                                : 'border-gray-300'
                                                                        }
                                                                    `}>
                                                                        <span className={`
                                                                            text-sm font-medium
                                                                            ${showResults
                                                                                ? option.is_correct || isSelected ? 'text-white' : 'text-gray-500'
                                                                                : isSelected ? 'text-white' : 'text-gray-500'
                                                                            }
                                                                        `}>
                                                                            {option.label}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-base">{option.content}</span>
                                                                        {showResults && (
                                                                            <div className={`
                                                                                text-sm mt-1
                                                                                ${option.is_correct ? 'text-green-600' : isSelected ? 'text-red-600' : ''}
                                                                            `}>
                                                                                {option.is_correct && '✓ Doğru Cevap'}
                                                                                {isSelected && !option.is_correct && '✗ Yanlış Cevap'}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Navigasyon Butonları */}
                                            <div className="flex justify-between items-center pt-4">
                                                <button
                                                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                                    disabled={currentQuestionIndex === 0}
                                                    className={`
                                                        flex items-center gap-2 px-4 py-2 rounded-lg
                                                        ${currentQuestionIndex === 0
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-gray-600 hover:bg-gray-50'
                                                        }
                                                    `}
                                                >
                                                    <ChevronRight className="w-4 h-4 rotate-180" />
                                                    Önceki Soru
                                                </button>

                                                {currentQuestionIndex === quizQuestions.length - 1 ? (
                                                    <button
                                                        onClick={handleQuizSubmit}
                                                        disabled={showResults}
                                                        className={`
                                                            flex items-center gap-2 px-6 py-2 rounded-lg transition-colors
                                                            ${showResults
                                                                ? 'bg-gray-400 cursor-not-allowed'
                                                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                                                            }
                                                        `}
                                                    >
                                                        {showResults ? 'Quiz Tamamlandı' : 'Quiz\'i Tamamla'}
                                                        {!showResults && <ArrowRight className="w-4 h-4" />}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                                        className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                    >
                                                        Sonraki Soru
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 