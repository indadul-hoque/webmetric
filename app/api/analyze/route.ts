import { NextResponse } from "next/server";
import * as htmlparser2 from "htmlparser2";

// ==========================================
// TYPE DEFINITIONS & SCHEMAS
// ==========================================

/**
 * Strict structure enforcing the precise data topology returned by the local analyzer fallback.
 * It matches exactly what the client-side UI demands for metrics rendering.
 */
interface LocalAnalysisResult {
  url: string; // The fully qualified destination URL targeted for analysis
  domain: string; // The target's clean hostname isolated from protocols and paths
  protocol: string; // The underlying connection scheme resolved (typically http: or https:)
  loadTimeMs: number; // Total duration measured in milliseconds to pull the document body down
  pageSizeKb: number; // Mathematical file size footprint of the uncompressed text string payload
  headers: Record<string, string>; // Security and server optimization headers harvested from the target
  meta: {
    title?: string; // Explicit title string found mapped inside metadata structures
    description?: string; // Text payload describing page focus to indexing search spiders
    keywords?: string; // Legacy targeted taxonomy tags mapped within metadata containers
    viewport?: string; // Layout scaling configuration defining mobile responsive properties
    ogTitle?: string; // OpenGraph Title optimization tag formatting platform shares
    ogDescription?: string; // OpenGraph descriptive block styling link preview snippets
    ogImage?: string; // Direct image URL referenced during external card embeds
    charset?: string; // The encoding standard explicitly defined for document parsing
    robots?: string; // Structural parsing and indexing instructions directed at crawl bots
  };
  resources: {
    // Structural counts tracking Javascript block configuration densities
    scripts: {
      total: number;
      external: number;
      inline: number;
      sources: string[];
    };
    // Structural counts tracking cascading stylesheet layout blocks
    stylesheets: {
      total: number;
      external: number;
      inline: number;
      sources: string[];
    };
    // Accessibility and structural profiling configurations for parsed images
    images: {
      total: number;
      webpOrAvif: number;
      legacy: number;
      missingAlt: number;
      sources: { src: string; alt?: string }[];
    };
    // Anchors taxonomy mapping tracking internal/external split mechanics
    links: {
      total: number;
      internal: number;
      external: number;
      list: string[];
    };
  };
  headings: {
    total: number; // Flat count summarizing all structural headers found from h1 down to h6
    h1Count: number; // Isolated tracking identifying precise top-tier title configurations
    structure: { tag: string; text: string }[]; // Hierarchical array mapping real contextual tag trees
  };
  // Metrics containers tracking normalized points, passing indicators, warnings and execution blocks
  seo: {
    score: number;
    passes: string[];
    warnings: string[];
    errors: string[];
  };
  accessibility: {
    score: number;
    passes: string[];
    warnings: string[];
    errors: string[];
  };
  bestPractices: {
    score: number;
    passes: string[];
    warnings: string[];
    errors: string[];
  };
}

// ==========================================
// CORE HTML SAFE STREAM PARSER
// ==========================================

/**
 * State-driven streaming markup execution stack leveraging htmlparser2.
 * It avoids Catastrophic Backtracking regular expression lockouts by utilizing deterministic parsing.
 *
 * @param html The raw source code string pulled down from the network target
 * @param domain The clean hostname context utilized to classify internal versus external outbound links
 */
function parseHtmlSafely(html: string, domain: string) {
  // Initialize atomic metadata objects to safely isolate parsing contexts per function execution
  const meta: LocalAnalysisResult["meta"] = {};
  const scripts = { total: 0, external: 0, inline: 0, sources: [] as string[] };
  const stylesheets = {
    total: 0,
    external: 0,
    inline: 0,
    sources: [] as string[],
  };
  const images = {
    total: 0,
    webpOrAvif: 0,
    legacy: 0,
    missingAlt: 0,
    sources: [] as { src: string; alt?: string }[],
  };
  const links = { total: 0, internal: 0, external: 0, list: [] as string[] };
  const headings: LocalAnalysisResult["headings"] = {
    total: 0,
    h1Count: 0,
    structure: [],
  };

  // Streaming tracking state pointers maintaining memory boundaries during sequential block parsing
  let currentTag = ""; // Keeps track of the current open tag context
  let title = ""; // String accumulator gathering the primary page title context
  let headingTextAccumulator = ""; // Temporary string bucket isolating context nested inside structural headings

  // Instantiating the underlying event-driven compiler loop engine
  const parser = new htmlparser2.Parser(
    {
      // Fired instantly when any valid tag opener boundary opens up (e.g. <div class="container">)
      onopentag(name, attribs) {
        // Normalize tag casing to defend against unstandardized raw legacy markup styles
        currentTag = name.toLowerCase();

        // Handle the meta configuration evaluation loops
        if (currentTag === "meta") {
          const charset = attribs.charset; // Extract local file encoding declarations if present
          const metaName = attribs.name?.toLowerCase(); // Standardize metadata identification names
          const property = attribs.property?.toLowerCase(); // Extract social graph attributes (e.g., OpenGraph keys)
          const content = attribs.content || ""; // Extract value properties mapped inside metadata definitions

          if (charset) meta.charset = charset; // Safely preserve encoding type context properties

          // Pick the active identifier key, selecting standard name parameters ahead of social graphs
          const key =
            metaName || property || attribs["http-equiv"]?.toLowerCase();
          if (key && content) {
            if (key === "description")
              meta.description = content; // Populate the clean standard SEO description field
            else if (key === "keywords")
              meta.keywords = content; // Populate the clean standard SEO keyword taxonomy lists
            else if (key === "viewport")
              meta.viewport = content; // Preserve responsive mobile layout metadata configurations
            else if (key === "robots")
              meta.robots = content; // Map strict indexing rules intended for spider nodes
            else if (key === "og:title")
              meta.ogTitle = content; // Assign programmatic open-graph title modifications
            else if (key === "og:description")
              meta.ogDescription = content; // Assign structural open-graph summary details
            else if (key === "og:image") meta.ogImage = content; // Route targeted open-graph image display resources
          }
        }

        // Track script dependency graphs and structural payloads
        if (currentTag === "script") {
          scripts.total++; // Increment global execution payload metric counter
          if (attribs.src) {
            scripts.external++; // Increment external file loader system metric mapping
            if (scripts.sources.length < 5) scripts.sources.push(attribs.src); // Cap asset collection to 5 items to avoid bloat
          } else {
            scripts.inline++; // Register presence of non-cached embedded javascript layout
          }
        }

        // Track linked asset resource nodes matching CSS patterns
        if (currentTag === "link") {
          const rel = attribs.rel?.toLowerCase(); // Capture and normalize the link mapping type declaration
          if (rel === "stylesheet") {
            stylesheets.total++; // Increment cumulative tracking counters for UI display
            stylesheets.external++; // Route metrics category specifically toward network lookups
            if (stylesheets.sources.length < 5 && attribs.href) {
              stylesheets.sources.push(attribs.href); // Cache resource tracking references safely inside scope limits
            }
          }
        }

        // Capture direct internal stylesheet overrides
        if (currentTag === "style") {
          stylesheets.total++; // Accumulate total layouts parsed from data blocks
          stylesheets.inline++; // Route structural flags specifically inside embedded inline state arrays
        }

        // Document profiling algorithms evaluating visual assets
        if (currentTag === "img") {
          images.total++; // Track target site graphical configuration depth
          const src = attribs.src || ""; // Isolate exact underlying layout reference path
          const alt = attribs.alt; // Harvest critical accessibility placeholder elements

          // Evaluate image container structure optimization paths
          if (/\.(webp|avif|svg)/i.test(src))
            images.webpOrAvif++; // Verify modern high-performance compression format presence
          else images.legacy++; // Catch raw structural dependencies relying on unoptimized sizes

          // Evaluate missing descriptive alternative tags
          if (alt === undefined || alt.trim() === "") images.missingAlt++; // Identify blind spots affecting screen readers
          if (images.sources.length < 5 && src) {
            images.sources.push({ src, alt }); // Retain targeted snapshot examples matching interface schema bounds
          }
        }

        // Evaluation routing capturing hypertext anchors
        if (currentTag === "a") {
          const href = attribs.href; // Extract target navigation path properties
          if (href) {
            links.total++; // Log basic document link density metrics
            // Verify domain context parameters to evaluate internal relative routes from third-party ecosystems
            const isExternal =
              /^https?:\/\//i.test(href) && !href.includes(domain);
            if (isExternal)
              links.external++; // Map count toward domain-external exit gateways
            else links.internal++; // Classify layout properties as localized user paths

            // Accumulate valid reference examples while disregarding local hashes or script shortcuts
            if (
              links.list.length < 8 &&
              !href.startsWith("#") &&
              !href.startsWith("javascript:")
            ) {
              links.list.push(href);
            }
          }
        }

        // Catch the opening boundaries of title and structural heading definitions
        if (/^h[1-6]$/.test(currentTag)) {
          headings.total++; // Register total layout section header boundaries
          if (currentTag === "h1") headings.h1Count++; // Track top-tier topic headers to detect over-indexing
          headingTextAccumulator = ""; // Reset string bucket ahead of text buffer capture loop
        }
      },

      // Process plaintext data arrays found inside open and closed tags
      ontext(text) {
        if (currentTag === "title") {
          title += text; // Incrementally assemble split title data packages
        }
        if (/^h[1-6]$/.test(currentTag)) {
          headingTextAccumulator += text; // Accumulate fragmented text strings inside heading wrappers
        }
      },

      // Executed instantly when any valid closing tag layout completes (e.g. </div>)
      onclosetag(name) {
        const closedTag = name.toLowerCase(); // Read normal casing string representation
        if (/^h[1-6]$/.test(closedTag)) {
          let cleanText = headingTextAccumulator.trim(); // Strip spacing artifacts out of structured data strings
          if (cleanText.length > 50) {
            cleanText = cleanText.substring(0, 47) + "..."; // Truncate long strings to keep table responses tidy
          }
          if (headings.structure.length < 15) {
            headings.structure.push({ tag: closedTag, text: cleanText }); // Map parsed structure down to output array layers
          }
        }
        currentTag = ""; // Reset active tag focus pointer immediately upon close sequence
      },
    },
    { decodeEntities: true },
  ); // Turn on HTML entity decoding for symbols like &amp;

  // Process the full text block string through our state engine
  parser.write(html);
  parser.end(); // Secure the streaming boundary and shut down active context tracking

  // Return formatted datasets back out to layout processors
  return {
    title: title.trim(),
    meta,
    scripts,
    stylesheets,
    images,
    links,
    headings,
  };
}

// ==========================================
// LOCAL SCRAPER ANALYSIS ROUTINE
// ==========================================

/**
 * Executes a fast, localized scraping pass on a destination webpage.
 * Runs programmatic audits evaluating basic SEO setups, accessibility scores, and best practices.
 */
async function runLocalAnalysis(
  url: string,
  parsedUrl: URL,
): Promise<LocalAnalysisResult> {
  const start = Date.now(); // Start execution timer for performance tracking
  const controller = new AbortController(); // Instantiate connection abort signal processor
  const timeoutId = setTimeout(() => controller.abort(), 7000); // Set a hard 7-second cutoff to prevent hanging server loops

  let response: Response;
  try {
    // Fire full HTML fetch pipeline
    response = await fetch(url, {
      signal: controller.signal, // Bind abort limits to network operations
      headers: {
        // Disguise traffic as a standard desktop browser to bypass automated proxy-blocking firewalls
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 WebMetricAnalyzer/1.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });
  } catch (e: any) {
    throw new Error(`Failed to connect to ${url}: ${e.message}`); // Catch downstream target configuration routing breakdowns
  } finally {
    clearTimeout(timeoutId); // Always tear down timer mappings instantly when execution finishes
  }

  const loadTimeMs = Date.now() - start; // Compute absolute load time delta
  const contentType = response.headers.get("content-type") || ""; // Inspect content payload headers

  // Throw an error if the endpoint tries to send binary data instead of text document files
  if (!contentType.includes("html") && !contentType.includes("xhtml")) {
    throw new Error(
      `URL is not an HTML document (Content-Type: ${contentType})`,
    );
  }

  const html = await response.text(); // Read the whole payload string layer directly into memory
  const pageSizeKb = Math.round((html.length / 1024) * 10) / 10; // Calculate real document file footprints
  const domain = parsedUrl.hostname; // Isolate clean routing configurations for links evaluation

  // Extract critical server security markers from header arrays
  const headers: Record<string, string> = {};
  const importantHeaders = [
    "server",
    "content-encoding",
    "cache-control",
    "x-frame-options",
    "strict-transport-security",
    "content-security-policy",
    "x-content-type-options",
  ];
  importantHeaders.forEach((h) => {
    const val = response.headers.get(h); // Read internal header properties
    if (val) headers[h] = val; // Safe-map fields straight into responses
  });

  // Execute safe parser execution
  const parsedData = parseHtmlSafely(html, domain);

  // Initialize scoring vectors starting at optimal 100-point baselines
  const seo = {
    score: 100,
    passes: [] as string[],
    warnings: [] as string[],
    errors: [] as string[],
  };
  const accessibility = {
    score: 100,
    passes: [] as string[],
    warnings: [] as string[],
    errors: [] as string[],
  };
  const bestPractices = {
    score: 100,
    passes: [] as string[],
    warnings: [] as string[],
    errors: [] as string[],
  };

  // ----------------------------------------
  // SEO SCORE CALCULATOR LAYER
  // ----------------------------------------
  if (parsedData.title) {
    if (parsedData.title.length >= 10 && parsedData.title.length <= 60) {
      seo.passes.push(
        `Title tag is descriptive and optimal length (${parsedData.title.length} chars)`,
      );
    } else {
      seo.score -= 10; // Deduct partial weight if optimization targets miss bounds
      seo.warnings.push(
        `Title tag length (${parsedData.title.length} chars) is outside recommended 10-60 characters`,
      );
    }
  } else {
    seo.score -= 30; // Heavily penalize pages with totally absent title blocks
    seo.errors.push("Missing <title> tag on the page");
  }

  if (parsedData.meta.description) {
    const descLen = parsedData.meta.description.length;
    if (descLen >= 50 && descLen <= 160) {
      seo.passes.push("Meta description is present and of optimal length");
    } else {
      seo.score -= 10; // Minor optimization deductions
      seo.warnings.push(
        `Meta description length (${descLen} chars) is outside recommended 50-160 characters`,
      );
    }
  } else {
    seo.score -= 25; // Deduct points for missing description headers
    seo.errors.push("Missing meta description tag");
  }

  if (parsedData.headings.h1Count === 1) {
    seo.passes.push("Exactly one H1 heading found on the page");
  } else if (parsedData.headings.h1Count === 0) {
    seo.score -= 15; // Deduct score for lack of single target structural anchor
    seo.errors.push(
      "No H1 heading found. Pages should have one H1 for main topic definition",
    );
  } else {
    seo.score -= 10; // Warn about over-indexing with multiple H1 declarations
    seo.warnings.push(
      `Multiple H1 headings found (${parsedData.headings.h1Count}). Recommended to use only one H1`,
    );
  }

  if (parsedData.meta.viewport) {
    seo.passes.push("Viewport meta tag configured for mobile responsiveness");
  } else {
    seo.score -= 20; // Knock points off if layout lacks responsive view scaling directives
    seo.errors.push(
      "Missing viewport meta tag. Page is not optimized for mobile browsers",
    );
  }

  if (html.includes('rel="canonical"')) {
    seo.passes.push(
      "Canonical link element exists to prevent duplicate content issues",
    );
  } else {
    seo.score -= 10; // Note canonical link gaps that risk crawl duplication
    seo.warnings.push('Missing canonical link tag (<link rel="canonical">)');
  }

  // ----------------------------------------
  // ACCESSIBILITY SCORE CALCULATOR LAYER
  // ----------------------------------------
  if (parsedData.images.total > 0) {
    const missingAltPercentage =
      (parsedData.images.missingAlt / parsedData.images.total) * 100;
    if (parsedData.images.missingAlt === 0) {
      accessibility.passes.push("All images have alt tags defined");
    } else if (missingAltPercentage > 50) {
      accessibility.score -= 25; // Drastically slash points for major screen-reader layout omissions
      accessibility.errors.push(
        `Critical accessibility issue: ${parsedData.images.missingAlt}/${parsedData.images.total} images are missing an alt attribute`,
      );
    } else {
      accessibility.score -= 15; // Moderate penalty for lesser descriptive alt tag failures
      accessibility.warnings.push(
        `${parsedData.images.missingAlt} images are missing alt attributes`,
      );
    }
  } else {
    accessibility.passes.push("No images present");
  }

  // Check language configuration setup on base templates
  const langMatch = html.match(/<html[^>]*lang=["']([^"']+)["']/i);
  if (langMatch) {
    accessibility.passes.push(
      `HTML lang attribute is specified: "${langMatch[1]}"`,
    );
  } else {
    accessibility.score -= 20; // Penalize template configuration if missing localized parameters
    accessibility.errors.push("HTML element is missing a lang attribute");
  }

  // ----------------------------------------
  // BEST PRACTICES CALCULATOR LAYER
  // ----------------------------------------
  if (parsedUrl.protocol === "https:") {
    bestPractices.passes.push(
      "Website uses HTTPS protocol (secure SSL connection)",
    );
  } else {
    bestPractices.score -= 30; // Apply major security score cuts for raw plain-text HTTP connections
    bestPractices.errors.push("Website does not use HTTPS.");
  }

  if (headers["strict-transport-security"]) {
    bestPractices.passes.push(
      "HTTP Strict Transport Security (HSTS) header is defined",
    );
  } else {
    bestPractices.score -= 10; // Note lack of permanent cryptographic enforcement policies
    bestPractices.warnings.push("HSTS header is not implemented");
  }

  // Clamp rating values strictly within standard 0-100 scales to safeguard dashboard presentation UI limits
  seo.score = Math.max(0, Math.min(100, seo.score));
  accessibility.score = Math.max(0, Math.min(100, accessibility.score));
  bestPractices.score = Math.max(0, Math.min(100, bestPractices.score));

  // Consolidate values cleanly matching target response interfaces
  return {
    url,
    domain,
    protocol: parsedUrl.protocol,
    loadTimeMs,
    pageSizeKb,
    headers,
    meta: parsedData.meta,
    resources: {
      scripts: parsedData.scripts,
      stylesheets: parsedData.stylesheets,
      images: parsedData.images,
      links: parsedData.links,
    },
    headings: parsedData.headings,
    seo,
    accessibility,
    bestPractices,
  };
}

// ==========================================
// ENDPOINT INBOUND POST ROUTE HANDLER
// ==========================================

/**
 * Main application routing gate processing automated system metrics requests.
 * Manages runtime forks routing requests either to local scraping logic or Google PageSpeed Insight engines.
 */
export async function POST(request: Request) {
  try {
    // Parse JSON request safely without crashing if empty strings are sent
    const body = await request.json().catch(() => ({}));
    const { url: rawUrl, mode = "local" } = body;

    // Validate parameters early to reject unprocessable execution loops
    if (!rawUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Standardize text configurations to protect background connection logic
    let url = rawUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url; // Default standard modern protocol configurations
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url); // Construct platform native URL validations
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      ); // Break early on broken inputs
    }

    // --------------------------------------
    // HIGH-PERFORMANCE LIGHTHOUSE ENGINE FORK
    // --------------------------------------
    if (mode === "lighthouse") {
      // Append authentication variables cleanly if configured in production server environments
      const apiKey = process.env.PAGESPEED_API_KEY
        ? `&key=${process.env.PAGESPEED_API_KEY}`
        : "";

      // Construct targeted upstream API endpoints query parameters targeting desktop execution profiles
      const psiUrl = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        url,
      )}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=desktop${apiKey}`;

      const controller = new AbortController(); // Setup deep-network tracing abort instances
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Grant PageSpeed API 15 seconds to finish structural traces

      try {
        const response = await fetch(psiUrl, {
          signal: controller.signal, // Link local system constraints directly to connection tasks
          headers: { Accept: "application/json" }, // Explicitly request standardized data results back
        });

        if (!response.ok)
          throw new Error(`PSI API responded status: ${response.status}`); // Detect and throw quota/network slips
        const data = await response.json(); // Read JSON payload arrays directly out of data pipelines
        clearTimeout(timeoutId); // Safeguard active listeners immediately upon operation finishes

        const lighthouse = data.lighthouseResult; // Extract the primary raw test outcome blocks
        const loadingExperience = data.loadingExperience; // Isolate real Chrome User Experience telemetry data packages

        // Map remote configurations straight into standard data contracts
        return NextResponse.json({
          url,
          scores: {
            performance: Math.round(
              (lighthouse.categories.performance?.score || 0) * 100,
            ),
            accessibility: Math.round(
              (lighthouse.categories.accessibility?.score || 0) * 100,
            ),
            bestPractices: Math.round(
              (lighthouse.categories["best-practices"]?.score || 0) * 100,
            ),
            seo: Math.round((lighthouse.categories.seo?.score || 0) * 100),
          },
          metrics: {
            fcp:
              lighthouse.audits["first-contentful-paint"]?.displayValue ||
              "N/A",
            lcp:
              lighthouse.audits["largest-contentful-paint"]?.displayValue ||
              "N/A",
            cls:
              lighthouse.audits["cumulative-layout-shift"]?.displayValue ||
              "N/A",
            tbt:
              lighthouse.audits["total-blocking-time"]?.displayValue || "N/A",
            speedIndex: lighthouse.audits["speed-index"]?.displayValue || "N/A",
            interactive:
              lighthouse.audits["interactive"]?.displayValue || "N/A",
          },
          crux: {
            overallStatus: loadingExperience?.overall_category || "UNKNOWN",
            metrics: {
              lcp:
                loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS
                  ?.percentile || null,
              cls:
                loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE
                  ?.percentile !== undefined
                  ? loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE
                      .percentile / 100
                  : null,
              inp:
                loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT
                  ?.percentile || null,
            },
          },
          isSimulated: false, // Signal client that data points represent live audits
        });
      } catch (e: any) {
        clearTimeout(timeoutId); // Safeguard background worker leaks if errors break the context early
        console.warn(
          "Falling back to structured local simulation context:",
          e.message,
        ); // Log underlying tracing network errors safely

        // Run localized scrapers to recover execution state if Google blocks the request
        const localData = await runLocalAnalysis(url, parsedUrl);
        // Estimate performance score deductions proportionally using script counts
        let perfScore = Math.max(
          35,
          Math.min(
            100,
            Math.round(98 - localData.resources.scripts.total * 1.5),
          ),
        );

        // Return gracefully simulated metric blocks to prevent UI screens from completely crashing
        return NextResponse.json({
          url,
          scores: {
            performance: perfScore,
            accessibility: localData.accessibility.score,
            bestPractices: localData.bestPractices.score,
            seo: localData.seo.score,
          },
          metrics: {
            fcp: "1.2 s",
            lcp: "2.4 s",
            cls: "0.01",
            tbt: "120 ms",
            speedIndex: "1.5 s",
            interactive: "2.8 s",
          },
          crux: {
            overallStatus: "COMPUTED_FALLBACK",
            metrics: { lcp: 2400, cls: 0.01, inp: 120 },
          },
          isSimulated: true, // Flag back down to UI that fields utilize generated estimates
        });
      }
    }

    // --------------------------------------
    // DEFAULT FAST LOCAL ANALYSIS FORK
    // --------------------------------------
    const localResult = await runLocalAnalysis(url, parsedUrl); // Execute fast internal HTML scanning passes
    return NextResponse.json(localResult); // Push metrics down to requesting frontend components
  } catch (error: any) {
    // Top-tier absolute safety wrapper catching unknown processing system runtime failures
    console.error("Critical Production Route Failure: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    ); // Mask details to avoid system fingerprinting hacks
  }
}
