"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const skills = [
  {
    title: "Data Engineering",
    description: "Designing and building scalable data pipelines and architectures.",
  },
  {
    title: "Data Warehousing",
    description: "Implementing and maintaining data warehouses like Snowflake, Redshift, and BigQuery.",
  },
  {
    title: "Data Analytics & Business Intelligence",
    description: "Developing dashboards and reports using Power BI, Tableau, and Looker.",
  },
  {
    title: "ETL & Data Integration",
    description: "Extracting, transforming, and loading data from diverse sources.",
  },
  {
    title: "Big Data Processing",
    description: "Working with Spark, Hadoop, and distributed data systems.",
  },
  {
    title: "Cloud Data Solutions",
    description: "Deploying and managing data solutions on AWS, Azure, and Google Cloud.",
  },
  {
    title: "Data Governance & Security",
    description: "Ensuring compliance, data privacy, and secure access controls.",
  },
  {
    title: "Machine Learning Pipelines",
    description: "Building and automating ML workflows and deploying models into production.",
  },
  {
    title: "Real-Time Data Streaming",
    description: "Implementing streaming pipelines with Kafka, Kinesis, and Pub/Sub.",
  },
  {
    title: "Data Quality & Observability",
    description: "Monitoring, validating, and improving data reliability and accuracy.",
  },
];

export default function Skills() {
  return (
    <section className="w-full py-10 bg-stone-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Our Data Engineering & Analytics Expertise</h2>
        <Accordion type="multiple" className="w-full">
          {skills.map((skill, index) => (
            <AccordionItem key={index} value={skill.title}>
              <AccordionTrigger className="text-left font-semibold text-gray-800">{skill.title}</AccordionTrigger>
              <AccordionContent className="text-gray-600">{skill.description}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
