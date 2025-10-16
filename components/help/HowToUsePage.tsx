"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-gray-700 space-y-3">{children}</div>
      )}
    </div>
  );
}

interface HowToUsePageProps {
  showCloseButton?: boolean;
}

export function HowToUsePage({ showCloseButton = false }: HowToUsePageProps) {
  const [activeSection, setActiveSection] = useState("getting-started");
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              How to Use Query Builder
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive guide to mastering academic research searches
            </p>
          </div>
          {showCloseButton && (
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                Contents
              </h2>
              <nav className="space-y-2">
                {[
                  { id: "getting-started", label: "Getting Started" },
                  { id: "search-blocks", label: "Search Blocks" },
                  { id: "operators", label: "Operators" },
                  { id: "exact-match", label: "Is Exact" },
                  { id: "journals", label: "Journals" },
                  { id: "filters", label: "Filters" },
                  { id: "examples", label: "Examples" },
                  { id: "tips", label: "Tips & Tricks" },
                  { id: "issues", label: "Common Issues" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                      activeSection === item.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Getting Started */}
            <section id="getting-started" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🚀 Getting Started
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Three-Step Process
                </h3>
                <ol className="space-y-2 text-blue-800">
                  <li>
                    <strong>1. Add Search Terms</strong> - Create search blocks
                    with your keywords
                  </li>
                  <li>
                    <strong>2. Configure Filters</strong> - Apply journal
                    ratings and year ranges
                  </li>
                  <li>
                    <strong>3. Search</strong> - Click &quot;Search on Google
                    Scholar&quot; to view results
                  </li>
                </ol>
              </div>
              <p className="text-gray-700">
                The Query Builder helps you create sophisticated, precise
                searches for academic papers on Google Scholar. Your query
                updates in real-time as you configure search parameters.
              </p>
            </section>

            {/* Search Blocks */}
            <section id="search-blocks" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📝 Understanding Search Blocks
              </h2>

              <CollapsibleSection
                title="What is a Search Block?"
                defaultOpen={true}
              >
                <p>
                  A search block is a single search criterion that specifies
                  where to search, what to search for, and how precise the match
                  should be.
                </p>
                <p className="mt-2">Each block contains:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>
                    <strong>Search In:</strong> Where to search (Title, Author,
                    Source, etc.)
                  </li>
                  <li>
                    <strong>Search Term:</strong> Your keywords
                  </li>
                  <li>
                    <strong>Is Exact:</strong> Toggle exact phrase matching
                  </li>
                  <li>
                    <strong>Operator:</strong> Relationship to other blocks
                  </li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Adding Search Blocks">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Click the &quot;Add Another Search&quot; button</li>
                  <li>
                    A new block appears (starts as &quot;All Fields&quot;)
                  </li>
                  <li>Configure the new block independently</li>
                  <li>It connects to the previous block with an operator</li>
                </ol>
              </CollapsibleSection>

              <CollapsibleSection title="Best Practices">
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <p className="font-semibold text-green-900">✅ DO:</p>
                    <ul className="text-sm text-green-800 mt-2 list-disc list-inside">
                      <li>
                        Use specific field selections (Author, Title, etc.)
                      </li>
                      <li>One concept per search block</li>
                      <li>Start broad, then narrow with AND</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                    <p className="font-semibold text-red-900">❌ Don&apos;t:</p>
                    <ul className="text-sm text-red-800 mt-2 list-disc list-inside">
                      <li>Leave search terms empty</li>
                      <li>Put multiple unrelated topics in one block</li>
                      <li>
                        Use complex boolean syntax (operators handle this)
                      </li>
                    </ul>
                  </div>
                </div>
              </CollapsibleSection>
            </section>

            {/* Operators */}
            <section id="operators" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🔗 Working with Operators
              </h2>

              <CollapsibleSection title="AND Operator" defaultOpen={true}>
                <p className="font-semibold text-blue-900 mb-2">
                  Meaning: Papers must contain BOTH search terms
                </p>
                <p className="mb-2">
                  Use AND to narrow your results by adding more requirements.
                </p>
                <p className="text-sm bg-blue-50 p-2 rounded">
                  Example: [Author] &quot;John Smith&quot; AND [Title]
                  &quot;machine learning&quot; returns papers where John Smith
                  is the author AND the title contains &quot;machine
                  learning&quot;
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="OR Operator">
                <p className="font-semibold text-green-900 mb-2">
                  Meaning: Papers can contain EITHER search term
                </p>
                <p className="mb-2">
                  Use OR to broaden results or search for related concepts.
                </p>
                <p className="text-sm bg-green-50 p-2 rounded">
                  Example: [Title] &quot;AI&quot; OR [Title] &quot;artificial
                  intelligence&quot; returns papers with either term in the
                  title
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="EXCLUDE Operator (NOT)">
                <p className="font-semibold text-orange-900 mb-2">
                  Meaning: Papers must NOT contain this search term
                </p>
                <p className="mb-2">
                  Use EXCLUDE to eliminate unwanted results from your search.
                </p>
                <p className="text-sm bg-orange-50 p-2 rounded">
                  Example: [Title] &quot;machine learning&quot; EXCLUDE
                  [Keywords] &quot;robotics&quot; returns machine learning
                  papers that do NOT discuss robotics
                </p>
              </CollapsibleSection>

              {/* <CollapsibleSection title="Operator Rules">
                  <div className="space-y-2 text-sm">
                    <p className="text-red-700">
                      ⚠️ Cannot use AND/OR after EXCLUDE - Keep EXCLUDE blocks at
                      the end
                    </p>
                    <p className="text-red-700">
                      ⚠️ First block cannot use &quot;with previous&quot; - It has no previous
                      block
                    </p>
                    <p className="text-red-700">
                      ⚠️ Last block cannot use &quot;with next&quot; - It has no next block
                    </p>
                    <p className="text-gray-600 mt-3">
                      The system prevents invalid combinations and shows helpful error
                      messages.
                    </p>
                  </div>
                </CollapsibleSection> */}
            </section>

            {/* Is Exact */}
            <section id="exact-match" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ✓ Using the &quot;Is Exact&quot; Feature
              </h2>

              <CollapsibleSection
                title="Regular Search (Is Exact OFF)"
                defaultOpen={true}
              >
                <p>
                  <strong>Behavior:</strong> Finds papers where the text
                  <em> contains </em>your search term
                </p>
                <p className="mt-2 text-sm">
                  Example: &quot;machine&quot; finds &quot;machine
                  learning&quot;, &quot;state machine&quot;, &quot;learning
                  machines&quot;
                </p>
                <p className="mt-2 text-sm bg-gray-50 p-2 rounded">
                  Use for: General concepts, exploring a field, maximizing
                  results
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="Exact Match (Is Exact ON)">
                <p>
                  <strong>Behavior:</strong> Finds papers where the text matches
                  your phrase <em> exactly </em>
                </p>
                <p className="mt-2 text-sm">
                  Example: &quot;machine learning&quot; (exact) finds that exact
                  phrase
                </p>
                <p className="mt-2 text-sm bg-gray-50 p-2 rounded">
                  Use for: Author names, specific phrases, technical terms,
                  journal titles
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="Real-World Comparison">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">
                          Query
                        </th>
                        <th className="border border-gray-300 p-2 text-left">
                          Regular
                        </th>
                        <th className="border border-gray-300 p-2 text-left">
                          Exact
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">
                          &quot;neural network&quot;
                        </td>
                        <td className="border border-gray-300 p-2">
                          2.5M results
                        </td>
                        <td className="border border-gray-300 p-2">
                          150K results
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-2">Broader</td>
                        <td className="border border-gray-300 p-2">
                          More comprehensive
                        </td>
                        <td className="border border-gray-300 p-2">
                          More precise
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CollapsibleSection>
            </section>

            {/* Journal Filtering */}
            <section id="journals" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📚 Journal Filtering
              </h2>

              <CollapsibleSection title="Journal Ratings" defaultOpen={true}>
                <div className="space-y-3">
                  <div className="border-l-4 border-red-500 bg-red-50 p-3">
                    <p className="font-semibold text-red-900">
                      A* (Tier 1) - 193 journals
                    </p>
                    <p className="text-sm text-red-800">
                      Top-tier, highly selective journals (Nature, Science,
                      PNAS)
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50 p-3">
                    <p className="font-semibold text-green-900">
                      A (Tier 2) - 623 journals
                    </p>
                    <p className="text-sm text-green-800">
                      High quality, rigorous peer review
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-3">
                    <p className="font-semibold text-blue-900">
                      B (Tier 3) - 800 journals
                    </p>
                    <p className="text-sm text-blue-800">
                      Good quality, solid peer review
                    </p>
                  </div>
                  <div className="border-l-4 border-amber-500 bg-amber-50 p-3">
                    <p className="font-semibold text-amber-900">
                      C (Tier 4) - 894 journals
                    </p>
                    <p className="text-sm text-amber-800">
                      Established journals, peer reviewed
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="How to Filter">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    <strong>Select Field(s)</strong> - Choose research area(s)
                  </li>
                  <li>
                    <strong>Available Journals Update</strong> - List shows only
                    selected fields
                  </li>
                  <li>
                    <strong>Select Rating(s)</strong> - Check desired quality
                    tiers
                  </li>
                  <li>
                    <strong>Quick Actions</strong> - Click &quot;Show All&quot;
                    or &quot;Show None&quot;
                  </li>
                  <li>
                    <strong>Select Journals</strong> - Check specific journals
                  </li>
                </ol>
                <p className="text-sm mt-3 bg-blue-50 p-2 rounded">
                  💡 Tip: &quot;Select All&quot; selects only visible journals
                  based on your current filters
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="Journal Statistics">
                <p className="text-sm">
                  <strong>Total Journals:</strong> 2,510 across 4 rating tiers
                </p>
                <p className="text-sm mt-2">
                  <strong>Research Fields:</strong> Commerce, Management,
                  Tourism, Services, Economics, Information Systems, Law, and
                  more
                </p>
                <p className="text-sm mt-2">
                  <strong>Default Selection:</strong> A* only (193 top-tier
                  journals)
                </p>
              </CollapsibleSection>
            </section>

            {/* Filters */}
            <section id="filters" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🔍 Advanced Filters
              </h2>

              <CollapsibleSection title="Year Range Filter" defaultOpen={true}>
                <p className="mb-2">
                  Limit results to papers published within a specific time
                  period.
                </p>
                <ul className="space-y-1 text-sm list-disc list-inside">
                  <li>
                    <strong>From:</strong> Earliest year to include
                  </li>
                  <li>
                    <strong>To:</strong> Latest year to include
                  </li>
                  <li>
                    <strong>Leave blank:</strong> No date restrictions
                  </li>
                </ul>
                <p className="text-sm mt-2 bg-gray-50 p-2 rounded">
                  Examples: Recent (From 2020), Classic (To 1990), Specific
                  decade (2010-2015)
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="Field of Research Filter">
                <p className="mb-2">
                  Limit results to papers from specific academic disciplines.
                </p>
                <p className="text-sm">
                  <strong>Multi-select:</strong> Choose multiple fields at once
                </p>
                <p className="text-sm mt-2">
                  <strong>Auto-sync:</strong> Journal list updates to show only
                  journals in selected fields
                </p>
                <p className="text-sm mt-2 bg-gray-50 p-2 rounded">
                  When you select a field, available journals automatically
                  filter to match that field
                </p>
              </CollapsibleSection>
            </section>

            {/* Real-World Examples */}
            <section id="examples" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                💡 Real-World Examples
              </h2>

              <CollapsibleSection
                title="Example 1: Find Recent Papers by Top Authors"
                defaultOpen={true}
              >
                <p className="font-semibold mb-2">Goal:</p>
                <p className="text-sm mb-3">
                  Find papers on deep learning by Yann LeCun published in top
                  journals after 2020
                </p>

                <p className="font-semibold mb-2">Configuration:</p>
                <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                  <p>
                    <strong>Block 1:</strong> [Article Title] &quot;deep
                    learning&quot;
                  </p>
                  <p>
                    <strong>Operator:</strong> AND
                  </p>
                  <p>
                    <strong>Block 2:</strong> [Author] &quot;Yann LeCun&quot;
                    (Is Exact ON)
                  </p>
                  <p>
                    <strong>Filters:</strong> A* journals, From: 2020
                  </p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Example 2: Comprehensive Topic Survey with Exclusions">
                <p className="font-semibold mb-2">Goal:</p>
                <p className="text-sm mb-3">
                  Find papers on AI but exclude those specifically about
                  robotics
                </p>

                <p className="font-semibold mb-2">Configuration:</p>
                <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                  <p>
                    <strong>Block 1:</strong> [Article Title] &quot;artificial
                    intelligence&quot;
                  </p>
                  <p>
                    <strong>Operator:</strong> OR
                  </p>
                  <p>
                    <strong>Block 2:</strong> [Article Title] &quot;machine
                    learning&quot;
                  </p>
                  <p>
                    <strong>Operator:</strong> EXCLUDE
                  </p>
                  <p>
                    <strong>Block 3:</strong> [Keywords] &quot;robotics&quot;
                    (Is Exact ON)
                  </p>
                  <p>
                    <strong>Filters:</strong> A*, A journals
                  </p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Example 3: Author Citation Search">
                <p className="font-semibold mb-2">Goal:</p>
                <p className="text-sm mb-3">
                  Find all papers by Jennifer Doudna in Nature journals
                </p>

                <p className="font-semibold mb-2">Configuration:</p>
                <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                  <p>
                    <strong>Block 1:</strong> [Author] &quot;Jennifer
                    Doudna&quot; (Is Exact ON)
                  </p>
                  <p>
                    <strong>Operator:</strong> AND
                  </p>
                  <p>
                    <strong>Block 2:</strong> [Source] &quot;Nature&quot; (Is
                    Exact ON)
                  </p>
                  <p>
                    <strong>Filters:</strong> Select Nature journals
                    specifically
                  </p>
                </div>
              </CollapsibleSection>
            </section>

            {/* Tips and Tricks */}
            <section id="tips" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ⚡ Tips & Tricks
              </h2>

              <CollapsibleSection
                title="Speed Up Your Search"
                defaultOpen={true}
              >
                <ul className="space-y-2 text-sm list-disc list-inside">
                  <li>
                    Set journal filters first - narrows results before searching
                  </li>
                  <li>
                    Use specific fields - faster than &quot;All Fields&quot;
                  </li>
                  <li>
                    Apply year constraints - older papers often less relevant
                  </li>
                  <li>Copy successful queries - save for future searches</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Refine Results Iteratively">
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>Run a broad search (many OR blocks)</li>
                  <li>Review results in Google Scholar</li>
                  <li>Return to Query Builder</li>
                  <li>Add AND blocks to narrow results</li>
                  <li>Repeat until you find what you need</li>
                </ol>
              </CollapsibleSection>

              <CollapsibleSection title="Debug Failed Searches">
                <div className="space-y-3">
                  <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                    <p className="font-semibold text-yellow-900 text-sm mb-2">
                      Too few results?
                    </p>
                    <ul className="text-sm text-yellow-800 list-disc list-inside space-y-1">
                      <li>Remove &quot;Is Exact&quot; - try broader search</li>
                      <li>Add OR blocks with synonyms</li>
                      <li>Reduce year constraints</li>
                      <li>Expand to B, C journals</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-500">
                    <p className="font-semibold text-orange-900 text-sm mb-2">
                      Too many results?
                    </p>
                    <ul className="text-sm text-orange-800 list-disc list-inside space-y-1">
                      <li>Add AND blocks to narrow</li>
                      <li>Use &quot;Is Exact&quot; for precision</li>
                      <li>Limit to A* journals only</li>
                      <li>Use smaller year range</li>
                    </ul>
                  </div>
                </div>
              </CollapsibleSection>
            </section>

            {/* Common Issues */}
            <section id="issues" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🆘 Common Issues & Solutions
              </h2>

              <CollapsibleSection
                title="Issue: Red Error on Operator"
                defaultOpen={true}
              >
                <p className="text-sm mb-2">
                  <strong>Cause:</strong> Invalid operator combination (e.g.,
                  AND after EXCLUDE)
                </p>
                <p className="text-sm mb-2">
                  <strong>Solution:</strong> Read the error message and follow
                  suggestions. System only allows valid combinations.
                </p>
                <p className="text-sm text-gray-600">
                  Keep EXCLUDE blocks at the end, use AND/OR in the middle.
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="Issue: No Results Found">
                <ul className="space-y-2 text-sm list-disc list-inside">
                  <li>
                    <strong>Remove &quot;Is Exact&quot;:</strong> Try broader
                    search
                  </li>
                  <li>
                    <strong>Add synonyms:</strong> Use OR with related terms
                  </li>
                  <li>
                    <strong>Expand filters:</strong> Include B, C rated journals
                  </li>
                  <li>
                    <strong>Check spelling:</strong> Especially for author names
                  </li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Issue: Too Many Results">
                <ul className="space-y-2 text-sm list-disc list-inside">
                  <li>
                    <strong>Add AND blocks:</strong> Narrow with more
                    constraints
                  </li>
                  <li>
                    <strong>Use &quot;Is Exact&quot;:</strong> For more precise
                    matching
                  </li>
                  <li>
                    <strong>Limit journals:</strong> Select A* only
                  </li>
                  <li>
                    <strong>Tighten year range:</strong> Reduce to recent years
                  </li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Best Practices Summary">
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <p className="font-semibold text-green-900 mb-2">✅ DO:</p>
                    <ul className="text-sm text-green-800 list-disc list-inside space-y-1">
                      <li>Start with specific field selections</li>
                      <li>One concept per search block</li>
                      <li>Apply &quot;Is Exact&quot; for precision terms</li>
                      <li>Use AND to narrow, OR to broaden</li>
                      <li>Test queries iteratively</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                    <p className="font-semibold text-red-900 mb-2">
                      ❌ Don&apos;t:
                    </p>
                    <ul className="text-sm text-red-800 list-disc list-inside space-y-1">
                      <li>Put multiple topics in one block</li>
                      <li>Use complex boolean syntax manually</li>
                      <li>Select all 2,510 journals at once</li>
                      <li>Leave search terms empty</li>
                      <li>Use EXCLUDE without positive search</li>
                    </ul>
                  </div>
                </div>
              </CollapsibleSection>
            </section>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                Last Updated: October 16, 2025
              </p>
              <p className="text-center text-gray-500 text-sm mt-2">
                Happy Researching! 📚🔍
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
