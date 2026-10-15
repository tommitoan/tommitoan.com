FROM node:20-alpine AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . ./
RUN pnpm build

FROM nginx:1.27-alpine

COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

ENV PORT=8080
# Where the old blog and About addresses lead (nginx reads it when it starts). A staging pair sets this and the
# build-time NEXT_PUBLIC_BAZI_ORIGIN to the same origin.
ENV BAZI_ORIGIN=https://bazi.tommitoan.com
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
