"use client";

import React from "react";
import Link from "next/link";
import { Mail, Linkedin, Library } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-900 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-0.5 mb-2">
              <Library className="w-6 h-6 text-[#4D90FD]" />
              <h3 className="text-lg font-bold">Scholarle</h3>
            </div>
            <p className="text-sm text-gray-600">Query Builder</p>
            <p className="text-xs text-gray-500 mt-3">
              Build advanced academic search queries with precision and ease.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Query Builder
                </Link>
              </li>
              <li>
                <Link
                  href="/how-to-use"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Help & Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#citation"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Citation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              Contact & Feedback
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contact@scholarquery.app"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Get in Touch
                </a>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Send Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Copyright */}
          <div className="text-sm text-gray-600">
            <p>
              &copy; {currentYear} Scholarle Query Builder. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-6">
            <a
              href="linkedin.com/in/mathildaoladimeji"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
