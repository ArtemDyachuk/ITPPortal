# AWS Architecture (simple)

Purpose: short summary of the minimal AWS architecture used for this demo and why each service was chosen.

- **GitHub Actions (CI/CD)**
  - Role: build Docker images, push to ECR, trigger deploy via SSM.
  - Why: familiar CI, integrates with OIDC to assume an IAM role; no extra AWS setup required.

- **Amazon ECR (Elastic Container Registry)**
  - Role: store container images (frontend and backend).
  - Why: private, fast pulls from EC2; simple to integrate with GitHub Actions and IAM.

- **EC2 (single instance)**
  - Role: host Docker and run containers for frontend and backend.
  - Why: lowest-cost, simplest runtime for a small internal demo; you control the instance directly.

- **SSM (AWS Systems Manager)**
  - Role: run remote shell commands on EC2 from GitHub Actions (deploy script), without SSH keys.
  - Why: secure, avoids exposing SSH and simplifies automation in CI.

- **IAM Roles & Policies**
  - Role: give GitHub Actions permission to assume a deploy role, ECR push; give EC2 permission to read ECR and use SSM.
  - Why: least-privilege access via roles reduces long-lived credentials.

- **Security Group + VPC (Public subnet + IGW)**
  - Role: control inbound (SSH, HTTP/HTTPS or custom ports) and outbound access; route table points to Internet Gateway.
  - Why: secure network boundaries; allow public access to the demo site when needed.

- **Docker on EC2**
  - Role: runtime for containers; simple `docker run`/`docker pull` deployment.
  - Why: lightweight and easy to manage for a single-instance demo.

Notes / Alternatives

- For a production or higher-availability setup, consider **ECS (with EC2 or Fargate)** or **EKS**, plus an **ALB** for routing and health checks.
- If you want zero-downtime deploys and scaling with minimal ops, **ECS + Fargate** is a good next step.
- This architecture is intentionally minimal and cost-effective for an internal demo with very low traffic.

Next steps (optional):

- Add a small health-check script and restart policy, or switch to ECS to get native health checks and service management.
- Store runtime secrets in SSM Parameter Store or Secrets Manager instead of env vars.
