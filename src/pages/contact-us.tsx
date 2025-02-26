import { MessageCircle, HeadphonesIcon, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LandingPageNavBar } from "@/components/landing-page-navbar";
import { appConfig, formatAmountToNaira } from "@/lib/utils";

const contactOptions = [
  {
    icon: <MessageCircle className="w-6 h-6 text-primary" />,
    title: "Chat with us",
    description: "Need help setting up your store? Talk to our team.",
    actionText: "Start chatting",
    action: () => console.log("Chat action triggered"),
  },
  {
    icon: <HeadphonesIcon className="w-6 h-6 text-primary" />,
    title: "Customer Support",
    description: "We’re here to assist you.",
    actionText: "Contact support",
    action: () => console.log("Support action triggered"),
  },
  {
    icon: <MapPin className="w-6 h-6 text-primary" />,
    title: "Visit our office",
    description: "Stop by and meet us in person.",
    actionText: "Get directions",
    action: () => console.log("Directions action triggered"),
  },
  {
    icon: <Phone className="w-6 h-6 text-primary" />,
    title: "Call us",
    description: "Mon-Fri from 9am to 6pm.",
    actionText: "Give us a call",
    action: () => console.log("Call action triggered"),
  },
];

export default function ContactUS() {
  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <LandingPageNavBar />
      <div className="text-center mb-16 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in touch</h1>
        <p className="text-xl text-muted-foreground">
          Ready to build your dream store? Let’s chat about how we can help.
        </p>
      </div>
      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {contactOptions.map((option, index) => (
          <Card key={index} className="border rounded-lg">
            <CardContent className="pt-6">
              <div className="bg-slate-900 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                {option.icon}
              </div>
              <CardTitle className="text-xl mb-2">{option.title}</CardTitle>
              <p className="text-muted-foreground mb-4 truncate">
                {option.description}
              </p>
              <CardFooter className="p-0">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={option.action}
                >
                  {option.actionText}
                </Button>
              </CardFooter>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="multiple">
            <AccordionItem value="item-1">
              <AccordionTrigger>What services do you offer?</AccordionTrigger>
              <AccordionContent>
                We help small businesses build customized ecommerce stores,
                including templates, payment setup, and dynamic design options.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Do I need technical knowledge to use your platform?
              </AccordionTrigger>
              <AccordionContent>
                Not at all! Our platform is user-friendly and designed for
                non-technical users. You can set up your store easily.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What are your pricing plans?</AccordionTrigger>
              <AccordionContent>
                We offer a free plan and a premium plan at{" "}
                {formatAmountToNaira(appConfig.premiumAmount)}/month. The
                premium plan includes advanced features like custom store design
                and analytics.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I switch plans later?</AccordionTrigger>
              <AccordionContent>
                Yes, you can upgrade or downgrade your plan anytime from your
                account dashboard.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      {/* Contact Form */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Send us a message
        </h2>
        <form className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your email" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="How can we help?" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us more about your needs..."
              className="min-h-[150px]"
            />
          </div>
          <Button size="lg" className="w-full md:w-auto">
            Send message
          </Button>
        </form>
      </div>
    </div>
  );
}
