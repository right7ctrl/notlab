import { Suspense } from 'react'
import { use } from 'react'
import EditQuestionForm from './edit-question-form'

type Props = {
    params: Promise<{ id: string }>
}

export default function EditQuestionPage({ params }: Props) {
    const resolvedParams = use(params)

    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <EditQuestionForm questionId={resolvedParams.id} />
        </Suspense>
    )
} 