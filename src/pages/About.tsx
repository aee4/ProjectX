import Layout from "@/components/layout/Layout";
import { CheckCircle, Search, Filter, Bell, Users, Lightbulb, Target, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import aboutHero from "@/assets/about-hero.jpg";
import teamLead from "@/assets/team-lead.jpg";
import teamDevA from "@/assets/team-dev-a.jpg";
import teamDevB from "@/assets/team-dev-b.jpg";
import teamDesigner from "@/assets/team-designer.jpg";

const teamMembers = [
  { name: "Daniel Mensah", role: "Project Manager", image: teamLead },
  { name: "Mei Lin Chen", role: "Frontend Developer", image: teamDevA },
  { name: "Kwame Asante", role: "Backend Developer", image: teamDevB },
  { name: "Sarah Mitchell", role: "UI/UX Designer", image: teamDesigner },
  { name: "James Okafor", role: "Quality Assurance Engineer", image: teamDevA },
  { name: "Aisha Ibrahim", role: "DevOps Engineer", image: teamDevB },
  { name: "Rachel Thompson", role: "Product Designer", image: teamDesigner },
  { name: "Michael Adeyemi", role: "Technical Lead", image: teamLead },
];

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Access the Timetable",
    description: "Open ProjectX from any device and navigate to the venue allocation timetable.",
  },
  {
    number: "02",
    icon: Filter,
    title: "Filter by Building",
    description: "Use our intuitive filters to narrow down venues by building (A-F) or time slot.",
  },
  {
    number: "03",
    icon: Bell,
    title: "Stay Updated",
    description: "Receive instant updates whenever schedules change or rooms are reassigned.",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section with Full-Width Image */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={aboutHero}
            alt="Team Collaboration"
            className="h-full w-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        {/* Content */}
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl animate-slide-up">
            <span className="inline-block mb-4 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium backdrop-blur-md border border-secondary/30">
              About ProjectX
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Simplifying Venue Allocation at{" "}
              <span className="text-secondary">Central University</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              We're on a mission to eliminate scheduling chaos and make campus life smoother for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* What is ProjectX - Card Section */}
      <section className="py-24 section-warm">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="animate-slide-up">
              <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                What is ProjectX?
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                ProjectX is a comprehensive venue allocation and timetable management system 
                built specifically for Central University. It provides a centralized platform 
                where students, course representatives, and administrators can view, manage, 
                and coordinate classroom allocations with ease.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our system brings transparency and efficiency to the venue booking process, 
                ensuring that every class has a designated space without conflicts or confusion.
              </p>
              <Link to="/timetable" className="btn-primary group">
                Explore the Timetable
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Right - Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { icon: Target, label: "Clear Scheduling", desc: "No more double bookings" },
                { icon: Users, label: "For Everyone", desc: "Students & staff alike" },
                { icon: Lightbulb, label: "Smart System", desc: "Intelligent allocation" },
                { icon: Heart, label: "User Friendly", desc: "Easy to navigate" },
              ].map((item, index) => (
                <div 
                  key={item.label} 
                  className="card-feature text-center animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 text-secondary mb-4 transition-all duration-300 group-hover:scale-110">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-semibold">
                The Challenge
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                The Problem We Solve
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Before ProjectX, venue allocation was a source of constant frustration
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="card-elevated border-l-4 border-l-destructive animate-slide-up">
                <h3 className="font-bold text-foreground mb-2 text-lg">Venue Clashes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Before ProjectX, multiple classes were often scheduled in the same room 
                  at the same time, causing disruption and wasted time for both students and lecturers.
                </p>
              </div>
              
              <div className="card-elevated border-l-4 border-l-destructive animate-slide-up-delay-1">
                <h3 className="font-bold text-foreground mb-2 text-lg">Scheduling Confusion</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Students struggled to find updated venue information, leading to missed 
                  classes, wandering between buildings, and general frustration across campus.
                </p>
              </div>
              
              <div className="card-elevated border-l-4 border-l-secondary bg-gradient-to-r from-secondary/5 to-transparent animate-slide-up-delay-2">
                <h3 className="font-bold text-foreground mb-2 text-lg flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-secondary" />
                  Our Solution
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  ProjectX provides a real-time, centralized timetable that's always up-to-date. 
                  With color-coded venues, intuitive building filters, and instant notifications, 
                  finding your classroom is now as simple as a few clicks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 section-accent">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How ProjectX Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to never miss your classroom again
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative text-center animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                
                <div className="step-number mx-auto mb-6">
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="text-xs font-bold text-secondary mb-2">{step.number}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold">
              The Creators
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Team Alpha
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              The dedicated team behind ProjectX, committed to improving the 
              university experience for everyone.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className="text-center group animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative mb-6 inline-block">
                  <div className="absolute -inset-2 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="profile-image relative w-32 h-32 mx-auto"
                  />
                </div>
                <h3 className="font-bold text-foreground text-lg">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy to-navy-dark" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Built with Care for Central University
          </h2>
          <p className="text-primary-foreground/70 text-lg mb-10 leading-relaxed">
            ProjectX is more than just a scheduling tool—it's a commitment to making 
            academic life smoother, fairer, and more organized for every member of 
            our university community.
          </p>
          <Link to="/timetable" className="btn-secondary group">
            Explore Venue Allocations
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default About;
