// components/Testimonials.tsx

"use client";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah L.",
    title: "Pro Trader",
    avatar: "SL",
    quote:
      "Finis Oculus is my secret weapon. The AI signal is scarily accurate and has saved me from 'trading on hype' more times than I can count.",
  },
  {
    name: "Mark T.",
    title: "Quant Analyst, Apex Capital",
    avatar: "MT",
    quote:
      "The sentiment data is cleaner than any other source we've tested. We've integrated its signal into our own models with remarkable success.",
  },
  {
    name: "David K.",
    title: "Retail Investor",
    avatar: "DK",
    quote:
      "I used to spend 3 hours a night on research. Now I check my Finis Oculus dashboard for 10 minutes. The Financial Scorecard is a game-changer.",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, type: "spring", staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Testimonials() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="py-32"
    >
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="font-serif-display text-4xl font-bold text-gradient-hero md:text-5xl">
            What Our Traders Are Saying
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Don't just take our word for it. See how real traders are
            finding their edge.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <motion.div variants={cardVariants} key={item.name}>
              <Card className="h-full shadow-lg">
                <CardHeader className="flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {/* <AvatarImage src={item.avatarUrl} /> */}
                    <AvatarFallback>{item.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.title}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-lg font-medium leading-relaxed text-foreground">
                    " {item.quote} "
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}