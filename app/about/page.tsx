"use client";

import {
  Search,
  Target,
  Lightbulb,
  Award,
  Heart,
  BookOpen,
  Users,
  TrendingUp,
  Shield,
  ChevronRight,
} from "lucide-react";
import { ImageWithFallback } from "../../components/shared/ImageWithFallback";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const navigate = useRouter();
  const features = [
    {
      icon: Search,
      title: "Field-Specific Search",
      description:
        "Search by specific fields like article title, author, journal name, or keywords without learning complex syntax.",
    },
    {
      icon: Target,
      title: "Combine Criteria",
      description:
        "Combine multiple criteria without learning special operators.",
    },
    {
      icon: BookOpen,
      title: "Real-Time Preview",
      description: "See your search in real-time before you submit it.",
    },
    {
      icon: Shield,
      title: "Exclude Unwanted Results",
      description: "Exclude unwanted results with a simple checkbox.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4">
              <span className="text-sm">
                Scholarle: Designed for Smarter Academic Research
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl bg-linear-to-r from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent">
              About Scholarle
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Scholarle is your personal research assistant designed to make
              finding scholarle articles and academic papers simple and
              straightforward. Whether you&apos;re conducting a literature
              review, starting a new research project, or exploring a topic for
              the first time, Scholarle removes the friction from the search
              process.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button onClick={() => navigate.push("/")} className="px-8">
                Start Searching
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How Scholarle Works Section */}
      <section id="citation" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-blue-600">
                <Search className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">
                  How Scholarle Works
                </span>
              </div>
              <h2 className="text-gray-900">
                Scholarle makes academic research easier than ever before.
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You can search through a comprehensive database of journals
                curated from the latest ABDC Journal Quality List and
                departmental top journal lists, helping even new researchers
                identify credible sources and focus on high-impact publications
                relevant to their field. We value every user who engages with
                our platform and encourage you to share your experience via our
                testimonial page. Your feedback helps us improve and continue
                building a tool that truly supports the way you work.
              </p>
              <p className="text-gray-600 leading-relaxed">
                If you use or reference Scholarle in your research, please
                acknowledge it using the preferred citation format below:
              </p>
              <p>
                APA7: Oladimeji, M. (2025, October). Scholarle: Designed for
                Smarter Academic Research. http://www.scholarle.com/
              </p>
              <p>
                MLA9: Oladimeji, Mathilda.{" "}
                <i>Scholarle: Designed for Smarter Academic Research</i>,
                Mathilda Oladimeji, Oct. 2025, www.scholarle.com/.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1722248540590-ba8b7af1d7b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwbGlicmFyeXxlbnwxfHx8fDE3NjE1ODU4MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Students studying"
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 px-6 bg-linear-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute -inset-4 bg-linear-to-r from-purple-500 to-blue-500 rounded-2xl blur-2xl opacity-20"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1759844197486-5b3612c7d534?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtd29yayUyMGNvbGxhYm9yYXRpb24lMjBvZmZpY2V8ZW58MXx8fHwxNzYxNjEwOTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Team collaboration"
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-flex items-center gap-2 text-blue-600">
                <Target className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">
                  Our Mission
                </span>
              </div>
              <h2 className="text-gray-900">
                Democratizing Access to Academic Knowledge
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We believe that finding quality research shouldn&apos;t require
                a PhD in search strategies. Our mission is to democratize access
                to academic knowledge by making advanced paper discovery
                accessible to everyone—whether you&apos;re an experienced
                researcher or just beginning your academic journey.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Through technology and innovation, we&apos;re leveling the
                playing field for all researchers.
              </p>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">
                      Researcher-First Approach
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Every decision we make is guided by one question: How does
                      this benefit researchers?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-blue-600 mb-4">
              <Lightbulb className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">
                How We Help
              </span>
            </div>
            <h2 className="text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600">
              Instead of wrestling with complex search syntax, Scholarle
              presents you with a clean, intuitive interface where you can
              search the way you think.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <Users className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600 text-sm">
                Connect with other researchers, share experiences, and learn
                from experts.
              </p>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
              <TrendingUp className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600 text-sm">
                Monitor your research progress and see your discoveries unfold
                in real-time.
              </p>
            </div>
            <div className="bg-linear-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 border border-indigo-200">
              <Award className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-gray-900 mb-2">Success Stories</h3>
              <p className="text-gray-600 text-sm">
                Get inspired by thousands of researchers who have advanced their
                work through Scholarle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Scholarle Section */}
      <section className="py-20 px-6 bg-linear-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider text-blue-100">
                  Why Scholarle?
                </span>
              </div>
              <h2 className="text-white">More Than Just a Search Tool</h2>
              <p className="text-blue-50 leading-relaxed">
                Searching for academic papers should be empowering, not
                frustrating. Many researchers waste valuable time trying to
                formulate the perfect query or navigating confusing search
                interfaces. Scholarle bridges that gap by translating your
                straightforward requests into optimized searches that actually
                work.
              </p>
              <p className="text-blue-50 leading-relaxed">
                Our platform is constantly updated, user-friendly, and designed
                with researcher success in mind. Join thousands of researchers
                who have already found and accessed quality research through
                Scholarle.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-white/20 rounded-2xl blur-2xl"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1629196753813-8b4827ddc7c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBncmFkdWF0aW9uJTIwc3VjY2Vzc3xlbnwxfHx8fDE3NjE2MTU3MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Education success"
                className="relative rounded-2xl shadow-2xl w-full h-[450px] object-cover border-4 border-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758270705067-0d7edee57af0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwc3R1ZGVudHMlMjBjYW1wdXN8ZW58MXx8fHwxNzYxNjM5MTczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Diverse students"
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-blue-600">
                <Heart className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">
                  Our Commitment
                </span>
              </div>
              <h2 className="text-gray-900">Your Trust, Our Responsibility</h2>
              <p className="text-gray-600 leading-relaxed">
                We&apos;re committed to continuous improvement. Your feedback
                directly shapes how Scholarle evolves. We listen to researchers,
                students, and academics to ensure our tool meets your real-world
                needs.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We continuously improve our platform based on user feedback and
                remain dedicated to being your trusted partner in achieving
                research success. Scholarle is more than a tool—it&apos;s a
                community of learners supporting each other&apos;s aspirations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
