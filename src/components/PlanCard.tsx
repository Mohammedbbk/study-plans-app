import Link from "next/link";
import { Plan } from "@/app/api/_store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClockIcon } from "lucide-react";

type PlanCardProps = {
  plan: Plan;
};

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <Link
      href={`/plans/${plan.slug}`}
      className="block hover:shadow-lg transition-shadow duration-300 rounded-lg"
    >
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>{plan.title}</CardTitle>
          <CardDescription className="pt-2">{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center text-sm text-muted-foreground">
            <ClockIcon className="mr-2 h-4 w-4" />
            <span>{plan.durationWeeks} weeks</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {plan.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
