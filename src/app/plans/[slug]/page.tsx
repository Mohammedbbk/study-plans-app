import { notFound } from "next/navigation";
import { Plan } from "@/app/api/_store";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, ClockIcon } from "lucide-react";
import { SubscribeButton } from "@/components/SubscribeButton";

async function getPlan(slug: string): Promise<Plan | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/plans/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

type PlanDetailsPageProps = {
  params: {
    slug: string;
  };
};

export default async function PlanDetailsPage({
  params,
}: PlanDetailsPageProps) {
  const plan = await getPlan(params.slug);

  if (!plan) {
    notFound();
  }

  return (
    <main className="container py-12 px-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {plan.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{plan.title}</h1>
            <p className="text-lg text-muted-foreground">{plan.description}</p>
          </div>

          <Tabs defaultValue="modules">
            <TabsList>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            <TabsContent value="modules" className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                {plan.modules.map((module, index) => (
                  <AccordionItem value={`item-${index}`} key={module.id}>
                    <AccordionTrigger>{module.title}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-4">
                        {module.lessons.map((lesson) => (
                          <li
                            key={lesson}
                            className="flex items-center text-muted-foreground"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            <TabsContent value="faq" className="mt-4">
              <h3 className="font-semibold">Is this course for beginners?</h3>
              <p className="text-muted-foreground mt-1">
                Yes, this plan is designed to be accessible for beginners and
                covers all the fundamental concepts from scratch.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1">
          <div className="p-6 border rounded-lg sticky top-24">
            <h2 className="text-3xl font-bold">${plan.price}</h2>
            <p className="text-sm text-muted-foreground">One-time payment</p>

            <SubscribeButton planId={plan.id} planTitle={plan.title} />

            <div className="mt-6 space-y-3 pt-6 border-t">
              <div className="flex items-center text-sm">
                <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{plan.durationWeeks} week duration</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Lifetime access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
