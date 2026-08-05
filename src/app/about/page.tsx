
import React from "react";
import {
  HeartHandshake,
  ShieldCheck,
  Users,
  Target,
  TrendingUp,
  Sparkles,
  HandCoins,
  CircleCheck,
} from "lucide-react";

const AboutPage = () => {
  const features = [
    {
      icon: HeartHandshake,
      title: "Support Meaningful Causes",
      description:
        "Supporters can discover campaigns and contribute credits to projects that create positive change.",
    },
    {
      icon: Target,
      title: "Launch Your Campaign",
      description:
        "Creators can launch campaigns, share their stories, and raise credits from a supportive community.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Transparent",
      description:
        "Campaign approvals, contribution reviews, withdrawals, and user management help keep the platform trustworthy.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "FundWave connects supporters and creators in one platform where ideas and causes can grow together.",
    },
  ];

  const platformFeatures = [
    "Discover approved crowdfunding campaigns",
    "Create and manage fundraising campaigns",
    "Contribute credits to campaigns",
    "Purchase credits through available payment options",
    "Track contribution history and statuses",
    "Receive real-time platform notifications",
    "Request creator withdrawals",
    "Admin campaign and user management",
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Empowering Change Through Crowdfunding
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              About FundWave
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-purple-100 sm:text-lg">
              FundWave is a modern crowdfunding platform that connects
              passionate creators with supporters who want to make a
              meaningful difference.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-violet-600">
              Who We Are
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Turning ideas into meaningful impact
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              FundWave is designed to make crowdfunding simple, transparent,
              and accessible. Creators can present their ideas, causes, and
              projects while supporters can discover campaigns and contribute
              credits to the ones they believe in.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Our platform provides separate experiences for Supporters,
              Creators, and Administrators so that every part of the
              crowdfunding process can be managed efficiently.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <HandCoins className="h-8 w-8 text-violet-600" />
                <h3 className="mt-4 font-bold">Support</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Help projects grow through meaningful contributions.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <TrendingUp className="h-8 w-8 text-violet-600" />
                <h3 className="mt-4 font-bold">Grow</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Give creators the opportunity to turn ideas into reality.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-1 shadow-2xl">
              <div className="rounded-[22px] bg-white p-8 sm:p-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                  <HeartHandshake className="h-8 w-8 text-violet-600" />
                </div>

                <h3 className="mt-7 text-2xl font-bold text-slate-900">
                  One platform. Two sides. One purpose.
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  Supporters provide encouragement and credits. Creators
                  transform those contributions into real projects and
                  positive impact.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <CircleCheck className="h-5 w-5 shrink-0 text-violet-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Discover impactful campaigns
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <CircleCheck className="h-5 w-5 shrink-0 text-violet-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Support ideas you believe in
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <CircleCheck className="h-5 w-5 shrink-0 text-violet-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Build projects with community support
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
              Our Mission
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Make positive change easier to fund
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              We believe great ideas can come from anywhere. FundWave aims to
              provide a simple platform where creators can share their vision
              and supporters can help make that vision possible.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
                <Target className="h-7 w-7 text-violet-600" />
              </div>

              <h3 className="mt-5 text-xl font-bold">Purpose</h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Help creators turn valuable ideas and community projects into
                reality.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
                <ShieldCheck className="h-7 w-7 text-violet-600" />
              </div>

              <h3 className="mt-5 text-xl font-bold">Trust</h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Keep campaign approval, contribution status, and withdrawals
                organized and transparent.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
                <Users className="h-7 w-7 text-violet-600" />
              </div>

              <h3 className="mt-5 text-xl font-bold">Community</h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Bring creators and supporters together around projects that
                matter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
              What You Can Do
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Everything you need for crowdfunding
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              FundWave provides essential tools for discovering campaigns,
              supporting projects, managing campaigns, and monitoring platform
              activity.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 transition group-hover:bg-violet-600">
                    <Icon className="h-6 w-6 text-violet-600 group-hover:text-white" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Highlights */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
                Platform Highlights
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Built for creators and supporters
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                From campaign discovery to contribution tracking, FundWave
                brings the important parts of crowdfunding into one organized
                platform.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {platformFeatures.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

                  <span className="text-sm font-medium leading-6 text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 px-6 py-14 text-center shadow-xl sm:px-12">
          <HeartHandshake className="mx-auto h-12 w-12 text-white" />

          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Together, we can make ideas happen.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-violet-100">
            Whether you want to support a meaningful campaign or launch your
            own project, FundWave gives you the tools to take the next step.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/campaigns"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              Explore Campaigns
            </a>

            <a
              href="/register"
              className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Join FundWave
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;

