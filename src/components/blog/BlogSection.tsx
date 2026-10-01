import React from 'react';
import { motion } from 'framer-motion';

const posts = [
  {
    id: 1,
    title: "Building Resilient B2B Backends from Scratch",
    date: "Sep 2024",
    readTime: "8 min read",
    excerpt: "An architectural deep dive into multi-tenant isolation, cross-OS logical schema replication, and the pitfalls of ORMs."
  },
  {
    id: 2,
    title: "Adversary Emulation in Linux Workstations",
    date: "Aug 2024",
    readTime: "12 min read",
    excerpt: "Bypassing EDR mechanisms using raw syscalls and custom loaders. Red team operations for modern environments."
  },
  {
    id: 3,
    title: "Weekend Tinkering with Addressable LEDs & OpenSCAD",
    date: "Jul 2024",
    readTime: "5 min read",
    excerpt: "How I built a custom 3D-printed enclosure for a WLED-powered matrix display using ESP32."
  }
];

export default function BlogSection() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16">
        <h2 className="font-display text-5xl md:text-6xl">LATEST TRANSMISSIONS</h2>
        <button className="text-text-muted hover:text-text-primary font-mono text-sm mt-4 md:mt-0 transition-colors">
          VIEW_ALL_ARCHIVES
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="flex gap-4 items-center text-xs font-mono text-text-muted mb-4">
              <span>{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-border-subtle" />
              <span>{post.readTime}</span>
            </div>
            <h3 className="font-serif text-2xl font-bold mb-4 group-hover:text-accent-cyan transition-colors">
              {post.title}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-accent-cyan opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              <span>READ MORE</span>
              <span>→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
