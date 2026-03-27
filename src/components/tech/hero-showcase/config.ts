import type { HeroShowcaseConfig } from "./types";

export const heroShowcaseConfig: HeroShowcaseConfig = {
    layout: {
        frameMaxWidthRem: 40,
        stageMinHeightRem: 38,
        interactionZoneSizeRem: 36,
        offsetXRem: 1.2,
        offsetYRem: 0,
        scale: 0.84,
        lightSizeRem: 5.5,
        lightTopPercent: 4,
        lightRightPercent: 16,
        glowInsetPercent: 22,
        corePulseSizeRem: 7,
        coreIconSizeRem: 4.6,
        coreIconFontSizeRem: 1.8,
        ghostOrbitDiameterRem: 17.5
    },

    cycle: {
        idleDelayMs: 1500,
        bootDurationMs: 1750,
        visibleDurationMs: 3000,
        fadeDurationMs: 450,
        bootStaggerMs: 50
    },

    core: {
        icon: ">_",
        pulseFrom: "rgba(56, 189, 248, 0.18)",
        pulseTo: "rgba(168, 85, 247, 0.10)",
        iconGradient: ["#38bdf8", "#6366f1", "#d946ef"]
    },

    ghostTrackColor: "rgba(255, 255, 255, 0.05)",

    orbits: [
        {
            id: "inner",
            radius: 110,
            duration: 20,
            direction: "clockwise",
            trackColor: "rgba(96, 165, 250, 0.38)",
            defaultPlanetSizeRem: 1.15,
            tooltipDefaults: {
                distance: 72,
                beamLength: 72,
                minWidthRem: 9,
                textColor: "#eff6ff",
                accentColor: "#7dd3fc",
                surfaceFrom: "rgba(9, 17, 31, 0.94)",
                surfaceTo: "rgba(10, 32, 58, 0.82)",
                glowColor: "rgba(96, 165, 250, 0.18)"
            },
            nodes: [
                {
                    id: "go",
                    label: "Go",
                    startAngle: 0,
                    planetColor: "#00ADD8",
                    planetGlow: "rgba(0, 173, 216, 0.9)"
                },
                {
                    id: "kubernetes",
                    label: "Kubernetes",
                    startAngle: 72,
                    planetColor: "#326CE5",
                    planetGlow: "rgba(50, 108, 229, 0.9)"
                },
                {
                    id: "grpc",
                    label: "gRPC",
                    startAngle: 144,
                    planetColor: "#8B5CF6",
                    planetGlow: "rgba(139, 92, 246, 0.9)"
                },
                {
                    id: "postgresql",
                    label: "PostgreSQL",
                    startAngle: 216,
                    planetColor: "#336791",
                    planetGlow: "rgba(51, 103, 145, 0.9)"
                },
                {
                    id: "redis",
                    label: "Redis",
                    startAngle: 288,
                    planetColor: "#DC382D",
                    planetGlow: "rgba(220, 56, 45, 0.92)"
                }
            ]
        },

        {
            id: "outer",
            radius: 214,
            duration: 40,
            direction: "counterclockwise",
            trackColor: "rgba(168, 85, 247, 0.32)",
            defaultPlanetSizeRem: 1.18,
            tooltipDefaults: {
                distance: 118,
                beamLength: 118,
                minWidthRem: 9.5,
                textColor: "#f5f3ff",
                accentColor: "#c084fc",
                surfaceFrom: "rgba(17, 13, 34, 0.94)",
                surfaceTo: "rgba(31, 16, 58, 0.82)",
                glowColor: "rgba(168, 85, 247, 0.18)"
            },
            nodes: [
                {
                    id: "prometheus",
                    label: "Prometheus",
                    startAngle: 8,
                    planetColor: "#E6522C",
                    planetGlow: "rgba(230, 82, 44, 0.95)"
                },
                {
                    id: "argocd",
                    label: "Argo CD",
                    startAngle: 58,
                    planetColor: "#F59E0B",
                    planetGlow: "rgba(245, 158, 11, 0.92)"
                },
                {
                    id: "github-actions",
                    label: "GitHub Actions",
                    startAngle: 110,
                    planetColor: "#2088FF",
                    planetGlow: "rgba(32, 136, 255, 0.9)"
                },
                {
                    id: "helm",
                    label: "Helm",
                    startAngle: 162,
                    planetColor: "#2563EB",
                    planetGlow: "rgba(37, 99, 235, 0.9)"
                },
                {
                    id: "jaeger",
                    label: "Jaeger",
                    startAngle: 214,
                    planetColor: "#14B8A6",
                    planetGlow: "rgba(20, 184, 166, 0.9)"
                },
                {
                    id: "grafana",
                    label: "Grafana",
                    startAngle: 266,
                    planetColor: "#F97316",
                    planetGlow: "rgba(249, 115, 22, 0.92)"
                },
                {
                    id: "openapi",
                    label: "OpenAPI",
                    startAngle: 318,
                    planetColor: "#84CC16",
                    planetGlow: "rgba(132, 204, 22, 0.9)"
                }
            ]
        }
    ]
};
