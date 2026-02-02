import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CallToAction() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl"></h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">احصل على منصتك وابدأ الآن</p>
                    <p className="mt-4">لا تضيع الوقت في التعقيد التقني. منصتنا تمنحك الأدوات التي تحتاجها للتركيز على مشروعك وتحقيق أهدافك.</p>

                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <Button
                            asChild
                            size="lg">
                            <Link href="/">
                                <span>ابدأ الآن</span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline">
                            <Link href="/">
                                <span>تجربة مجانية</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}