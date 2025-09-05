import { Card, CardContent } from "@/components/ui/card";

export default function Stats() {
  const stats = [
    { label: "Projects Completed", value: "60+" },
    { label: "Active Clients", value: "20" },
    { label: "Data Pipelines Deployed", value: "100+" },
    { label: "Years of Experience", value: "5+" },
  ];

  return (
    <section className="w-full py-10 bg-slate-900 text-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-center mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
          {stats.map((item, index) => (
            <Card key={index} className="bg-white-100 text-center shadow-none border-none p-0">
              <CardContent className="py-2">
                <div className="text-white text-4xl font-bold mb-2">{item.value}</div>
                <div className="text-white">{item.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
