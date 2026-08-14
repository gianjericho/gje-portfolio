import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import type { ResumePdfData } from "./select";

const COLORS = {
  text: "#1a1a1a",
  muted: "#5c5c5c",
  rule: "#d4d4d4",
  accent: "#0f172a",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 8.5,
    lineHeight: 1.4,
    color: COLORS.text,
  },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", color: COLORS.accent },
  title: { fontSize: 10, color: COLORS.muted, marginTop: 2 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4, color: COLORS.muted },
  contactItem: { marginRight: 8 },
  sectionHeading: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    color: COLORS.accent,
    marginTop: 12,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.rule,
  },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  entryCompany: { fontFamily: "Helvetica-Bold" },
  entryPeriod: { color: COLORS.muted },
  entryRole: { color: COLORS.muted, marginBottom: 2 },
  bulletRow: { flexDirection: "row", marginTop: 1.5, paddingRight: 4 },
  bulletMark: { width: 8, color: COLORS.muted },
  bulletText: { flex: 1 },
  skillRow: { flexDirection: "row", marginTop: 2 },
  skillLabel: { width: 110, fontFamily: "Helvetica-Bold" },
  skillItems: { flex: 1, color: COLORS.muted },
  certLine: { color: COLORS.muted, marginTop: 2 },
});

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletMark}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export function ResumeDocument({ data }: { data: ResumePdfData }) {
  return (
    <Document title={`${data.name} — Resume`} author={data.name}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.contactRow}>
          <Text style={styles.contactItem}>{data.location}</Text>
          <Text style={styles.contactItem}>·</Text>
          <Link style={styles.contactItem} src={`mailto:${data.email}`}>{data.email}</Link>
          <Text style={styles.contactItem}>·</Text>
          <Text style={styles.contactItem}>{data.phone}</Text>
          <Text style={styles.contactItem}>·</Text>
          <Link style={styles.contactItem} src={data.github}>
            {data.github.replace("https://", "")}
          </Link>
          <Text style={styles.contactItem}>·</Text>
          <Link style={styles.contactItem} src={data.linkedin}>LinkedIn</Link>
          <Text style={styles.contactItem}>·</Text>
          <Link style={styles.contactItem} src={data.youtube}>YouTube</Link>
        </View>

        <Text style={styles.sectionHeading}>SUMMARY</Text>
        <Text>{data.summary}</Text>

        <Text style={styles.sectionHeading}>EXPERIENCE</Text>
        {data.experience.map((entry) => (
          <View key={`${entry.company}-${entry.period}`} wrap={false}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryCompany}>
                {entry.company} — {entry.location}
              </Text>
              <Text style={styles.entryPeriod}>{entry.period}</Text>
            </View>
            <Text style={styles.entryRole}>{entry.role}</Text>
            {entry.description.map((bullet, i) => (
              <Bullet key={i}>{bullet}</Bullet>
            ))}
          </View>
        ))}

        <Text style={styles.sectionHeading}>SELECTED PROJECTS</Text>
        {data.projects.map((project) => (
          <View key={project.title} wrap={false}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryCompany}>{project.title}</Text>
            </View>
            <Text style={styles.entryRole}>{project.techStack.join(" · ")}</Text>
            {project.highlights.map((highlight, i) => (
              <Bullet key={i}>{highlight}</Bullet>
            ))}
          </View>
        ))}

        <Text style={styles.sectionHeading}>EDUCATION</Text>
        {data.education.map((entry) => (
          <View key={entry.institution} style={styles.entryHeader}>
            <Text>
              <Text style={styles.entryCompany}>{entry.institution}</Text> — {entry.degree}
            </Text>
            <Text style={styles.entryPeriod}>{entry.period}</Text>
          </View>
        ))}

        <Text style={styles.sectionHeading}>SKILLS</Text>
        {data.skills.map((group) => (
          <View key={group.label} style={styles.skillRow}>
            <Text style={styles.skillLabel}>{group.label}</Text>
            <Text style={styles.skillItems}>{group.items.join(" · ")}</Text>
          </View>
        ))}

        <Text style={styles.sectionHeading}>CERTIFICATIONS</Text>
        <Text style={styles.certLine}>{data.certificationsLine}</Text>
      </Page>
    </Document>
  );
}
