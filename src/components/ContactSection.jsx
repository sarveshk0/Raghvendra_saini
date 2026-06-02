"use client";

import AnimatedSection from "./AnimatedSection";

export default function ContactSection({
  lang,
  t,
  formData,
  formSubmitted,
  handleInputChange,
  handleFormSubmit
}) {
  return (
    <section id="contact" className="py-0 bg-[#FAFAF7] relative overflow-hidden">
      <div className="ambient-blob w-[400px] h-[400px] bg-[#185FA5] top-10 left-[-100px] opacity-8" />

      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-12 gap-12">
        <AnimatedSection className="md:col-span-5" direction="left">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2A] tracking-tight mb-4">{t.contactTitle}</h2>
          <p className="text-sm text-[#5F5E5A] leading-relaxed mb-8">{t.contactSub}</p>

          <div className="flex flex-col gap-6">
            {[
              { icon: "📞", label: t.contactPhone, value: "+91 9454180009", href: "tel:+919454180009" },
              { icon: "✉️", label: t.contactEmail, value: "sainiraghvendra@gmail.com", href: "mailto:sainiraghvendra@gmail.com" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-xl glass flex items-center justify-center text-lg shadow-sm border border-[#e5e3dc] shrink-0">{item.icon}</span>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#888780] block">{item.label}</span>
                  <a href={item.href} className="text-sm font-semibold text-[#2C2C2A] hover:text-[#EF9F27] transition-colors">{item.value}</a>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-4">
              <span className="w-11 h-11 rounded-xl glass flex items-center justify-center text-lg shadow-sm border border-[#e5e3dc] shrink-0">📍</span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#888780] block">{t.contactAddress}</span>
                <span className="text-sm font-semibold text-[#2C2C2A] leading-relaxed">
                  {lang === "hi"
                    ? "खानपुर कदीम, दिघरुवा, बिन्दकी, फतेहपुर, उत्तर प्रदेश"
                    : "Khanpur Kadim, Digharua, Bindki, Fatehpur, Uttar Pradesh"}
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="md:col-span-7" direction="right" delay={100}>
          <div className="card-glass p-8 card-accent-saffron">
            {formSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <span className="text-5xl mb-4 animate-float">🙏</span>
                <h3 className="text-lg font-bold text-[#1D9E75]">{lang === "hi" ? "संदेश सफलतापूर्वक भेजा गया!" : "Message Sent Successfully!"}</h3>
                <p className="text-xs text-[#5F5E5A] mt-1">{lang === "hi" ? "हम जल्द ही आपसे संपर्क करेंगे।" : "We will get in touch with you shortly."}</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                {[
                  { label: t.contactFormName, name: "name", type: "text", required: true, placeholder: "e.g. Rakesh Kumar" },
                  { label: t.contactFormEmail, name: "email", type: "email", required: false, placeholder: "e.g. rakesh@example.com" },
                ].map(field => (
                  <div key={field.name}>
                    <label className="text-xs font-bold text-[#5F5E5A] block mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      required={field.required}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full text-sm border border-[#e5e3dc] rounded-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-white/60 backdrop-blur-sm"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-bold text-[#5F5E5A] block mb-2">{t.contactFormMsg}</label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="..."
                    className="w-full text-sm border border-[#e5e3dc] rounded-xl px-4 py-3 outline-none focus:border-[#EF9F27] focus:ring-2 focus:ring-[#EF9F27]/10 transition-all bg-white/60 backdrop-blur-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#EF9F27] to-[#BA7517] text-white hover:from-[#BA7517] hover:to-[#8a5410] font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-[#EF9F27]/20 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {t.contactFormBtn}
                </button>
              </form>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
