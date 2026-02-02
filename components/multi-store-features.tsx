import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'

export default function MultiStoreFeatures() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
           منصة واحدة.. خيارات واسعة
          </p>
                    <p className="mt-4">سواء كنت تدير وقفاً مستداماً، أو جمع تبرعات لخدمة المجتمع، أو أن تبني إمبراطوريتك التجارية؛ وفرنا لك الأدوات المتخصصة التي تحتاجها للانطلاق ...</p>
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Zap
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">منصة للتبرعات</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">استقبال التبرعات بسهولة ودعم الاشتراكات المتكررة مع تقارير شفافة تضمن تجربة متبرع واضحة وموثوقة.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Settings2
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">منصة للأوقاف</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">إدارة متكاملة لمشاريع الوقف مع تتبع دقيق للإيرادات والمصاريف، مصمم خصيصاً للمؤسسات الوقفية والخيرية.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Sparkles
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">متجر إلكتروني</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">منصة لبيع المنتجات والخدمات مع إدارة شاملة للطلبات وبوابات دفع عالمية، جاهزة لدعم نمو تجارتك وتوسعها.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
        />

        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)