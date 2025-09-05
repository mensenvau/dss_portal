import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="w-full bg-stone-50 py-16 border-t border-gray-200">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-2xl font-bold text-center">Contact Us</h2>
        <p className="text-gray-700 mb-12 text-lg">We're here to answer any questions about our data solutions and services.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Phone</h3>
              <p className="text-gray-700">{process.env.NEXT_PUBLIC_PHONE}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Location</h3>
              <p className="text-gray-700">{process.env.NEXT_PUBLIC_ADDRESS}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-gray-700">{process.env.NEXT_PUBLIC_EMAIL}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
