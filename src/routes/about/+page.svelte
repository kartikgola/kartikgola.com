<script>
	import SEO from '$lib/components/SEO.svelte';
	import { PAGE_META, SITE_CONFIG } from '$lib/config/site.js';
</script>

<SEO 
	title={PAGE_META.about.title}
	description={PAGE_META.about.description}
	keywords={PAGE_META.about.keywords}
	url="{SITE_CONFIG.url}/about"
/>

<article class="about">
	<h1>About Me</h1>
	
	<p>
		I'm Kartik Gola, a Senior Software Engineer with 8+ years of experience building 
		large-scale backend and distributed systems.
	</p>
	
	<p>
		I specialize in designing resilient microservices, durable execution workflows, and 
		revenue-critical systems that process millions of transactions daily. My work spans 
		the Kafka connector ecosystem, cloud usage reporting, cloud marketplace integrations,
		usage-based billing, and more.
	</p>
	
	<h2>Technical Expertise</h2>
	<ul>
		<li><strong>Languages:</strong> Go, Java, Python, JavaScript</li>
		<li><strong>Data Systems:</strong> Kafka, Kafka Streams, Temporal, PostgreSQL, DynamoDB, Redis, Flink, BigQuery</li>
		<li><strong>Cloud & Infra:</strong> Kubernetes, Docker, Terraform, Helm, Istio, AWS, GCP, Azure</li>
		<li><strong>Observability:</strong> OpenTelemetry, Prometheus, Grafana, Datadog</li>
	</ul>
</article>

<style>
	.about {
		max-width: 700px;
		margin: 0 auto;
	}

	h1 {
		margin-bottom: 1em;
	}

	h2 {
		margin-top: 2.5em;
		margin-bottom: 0.75em;
	}

	p {
		line-height: 1.7;
		margin-bottom: 1.25em;
	}

	ul {
		margin: 1.25em 0;
		padding-left: 2em;
		line-height: 1.7;
	}

	li {
		margin: 0.5em 0;
	}
</style>