import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

export default function Pricing() {


    const features = ["قوالب احترافية مخصصة", "تقارير وإحصائيات فورية","لوحة تحكم سهلة الاستخدام","دعم فني على مدار الساعة"];
    return (
        <div className="relative py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">وفرنا لك الأدوات الاحترافية التي تجعل إدارة منصتك أمراً سهلا..</h2>
                </div>
                <div className="mt-8 md:mt-20">
                    <div className="bg-card relative rounded-3xl border shadow-2xl shadow-zinc-950/5">
                        <div className="grid items-center gap-12 divide-y p-12 md:grid-cols-2 md:divide-x md:divide-y-0">
                            <div className="pb-12 text-center md:pb-0 md:pr-12">
                                <h3 className="text-2xl font-semibold">باقة المؤسسات</h3>
                                <p className="mt-2 text-lg">نوفر لك القوة والتحكم الذي تحتاجه منظمتك</p>
                                <span className="mb-6 mt-12 inline-block text-6xl font-bold">
                                    234<span className="text-2xl font-normal">ريال</span>
                                    <p className="text-base font-normal text-gray-600 dark:text-gray-300">اشتراك سنوي</p>
                                </span>
                                

                                <div className="flex justify-center">
                                    <Button
                                        asChild
                                        size="lg">
                                        <Link href="#">ابدأ الآن</Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="relative">
                                <ul
                                    role="list"
                                    className="space-y-4">
                                    {features.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2">
                                            <Check className="size-3" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-muted-foreground mt-6 text-sm">يتضمن أيضاً: ربط مباشر مع بوابات الدفع، بنية قابلة للتوسع مع نمو مبيعاتك، وتحديثات دورية مجانية تضمن أمان واستقرار منصتك.</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}