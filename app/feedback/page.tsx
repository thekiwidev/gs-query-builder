"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Bug, Lightbulb, ExternalLink, ChevronDown } from "lucide-react";
import { feedbackFormUrl } from "@/lib/utils";
import { useState } from "react";

export default function FeedbackPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share Your Feedback
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We value your input and are constantly working to improve the
            Scholarle experience. Your feedback is crucial in helping us
            understand what&apos;s working, what&apos;s not, and what you&apos;d
            like to see in the future.
          </p>
        </div>

        {/* Go to Feedback Form Button */}
        <div className="mb-16">
          <Link
            href={feedbackFormUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-[#4D90FD] hover:bg-[#3D7CDB] text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Go to Feedback Form
            </Button>
          </Link>
        </div>

        {/* How to Send Feedback Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            How to Send Feedback
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Email Us */}
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#4D90FD]" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Email Us</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  For general inquiries or detailed feedback, you can reach us
                  at{" "}
                  <Link
                    href="mailto:support@scholarle.com"
                    className="text-[#4D90FD] hover:underline"
                  >
                    support@scholarle.com
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>

            {/* Report a Bug */}
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Bug className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Report a Bug</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Encountered an issue? Please include the page URL, steps to
                  reproduce, and a screenshot if possible.
                </p>
              </CardContent>
            </Card>

            {/* Feature Requests */}
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Feature Requests
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Have a great idea? Describe what you&apos;d like to see and
                  how it would improve your research workflow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Two Column Layout for Guidelines and What Happens */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Feedback Guidelines */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Feedback Guidelines
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-green-600">✓</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  <strong>Be specific and provide context.</strong> Vague
                  feedback is harder to act on.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-green-600">✓</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  <strong>Focus on what you want to achieve,</strong> not just
                  the solution you envision.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-green-600">✓</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  <strong>Keep</strong> it constructive. We&apos;re here to
                  learn and improve.
                </p>
              </div>
            </div>
          </div>

          {/* What Happens With Your Feedback */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What Happens With Your Feedback
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#4D90FD] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-white">1</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our product team reviews every piece of feedback submitted.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#4D90FD] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-white">2</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Feedback is categorized and prioritized based on impact and
                  frequency.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#4D90FD] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-white">3</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Actionable insights are integrated into our development
                  roadmap.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Anonymous Feedback Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-16">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-medium text-white">i</span>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Anonymous Feedback
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Our Google Form allows for anonymous submissions. Providing your
                email is optional but helps us follow up if we have questions.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            FAQ About Feedback
          </h2>

          <div className="space-y-4">
            {[
              {
                question: "Will I get a direct response to my feedback?",
                answer:
                  "We review all feedback but may not respond individually to every submission. For urgent issues or specific questions, please email us directly at support@scholarle.com.",
              },
              {
                question:
                  "How long does it take for a suggestion to be implemented?",
                answer:
                  "Implementation timelines vary based on complexity, priority, and available resources. Simple improvements might be implemented within weeks, while major features could take several months.",
              },
              {
                question: "What if I find a critical security issue?",
                answer:
                  "Please report security issues immediately to security@scholarle.com. Do not submit security vulnerabilities through the public feedback form.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
