import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Achievement = {
    id: string
    title: string
    description: string
    type: string
    requirement: number
    icon: string
}

type UserProgress = {
    [type: string]: number // Her tip için sayaç
    completed_achievements: string[] // Tamamlanan başarım ID'leri
}

export async function checkAchievements(userId: string, type: string, count: number = 1) {
    const supabase = createClientComponentClient()

    // İlgili başarımları getir
    const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('type', type)

    if (!achievements) return

    // Kullanıcının mevcut progress'ini al
    const { data: profile } = await supabase
        .from('profiles')
        .select('progress')
        .eq('id', userId)
        .single()

    const userProgress: UserProgress = profile?.progress || {
        completed_achievements: []
    }

    // Mevcut sayacı güncelle
    const currentCount = (userProgress[type] || 0) + count
    userProgress[type] = currentCount

    // Her başarım için kontrol et
    for (const achievement of achievements) {
        // Başarım zaten tamamlanmışsa atla
        if (userProgress.completed_achievements.includes(achievement.id)) {
            continue
        }

        // Başarım tamamlandı mı kontrol et
        if (currentCount >= achievement.requirement) {
            // Tamamlanan başarımı ekle
            userProgress.completed_achievements.push(achievement.id)
            // Bildirim göster
            showAchievementNotification(achievement)
        }
    }

    // Progress'i güncelle
    const { error } = await supabase
        .from('profiles')
        .update({
            progress: userProgress
        })
        .eq('id', userId)

    if (error) {
        console.error('Progress güncellenirken hata oluştu:', error)
    }
}

function showAchievementNotification(achievement: Achievement) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Yeni Başarım!', {
            body: `${achievement.title} - ${achievement.description}`,
            icon: '/achievement-icon.png'
        })
    }
} 