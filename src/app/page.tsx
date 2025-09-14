import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
            Master New Skills with
            <span className="text-foreground"> Study Plans</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed text-pretty">
            Structured learning paths designed by experts. Choose from our curated collection of study plans and
            accelerate your learning journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/plans">
                Browse Study Plans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              <Link href="/me">My Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-balance">Why Choose Our Study Plans?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Our carefully crafted study plans provide structured learning experiences that help you achieve your goals
            faster.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center border border-border">
            <CardHeader className="pb-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl text-foreground">Structured Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Well-organized modules and lessons that build upon each other, ensuring comprehensive understanding.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border border-border">
            <CardHeader className="pb-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl text-foreground">Expert Curated</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Content created and reviewed by industry experts to ensure high-quality, up-to-date learning materials.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border border-border">
            <CardHeader className="pb-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl text-foreground">Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Monitor your learning journey with detailed progress tracking and personalized recommendations.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="border border-border rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-balance">Ready to Start Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Join thousands of learners who are already advancing their skills with our study plans.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/plans">
              Explore Study Plans
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-12 mt-24">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Study Plans App</h3>
          <p className="text-muted-foreground mb-8">Empowering learners with structured, expert-curated study plans.</p>
          <div className="flex justify-center space-x-8">
            <Link href="/plans" className="text-muted-foreground hover:text-foreground transition-colors">
              Study Plans
            </Link>
            <Link href="/me" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
