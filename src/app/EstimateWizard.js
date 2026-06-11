"use client";

import { useState } from "react";

export const pricingTable = {
  services: {
    lawnMowing: {
      label: "Mowing",
    },

    blowing: {
      label: "Blowing",
    },

    edging: {
      label: "Edging",
    },

    leafCleanup: {
      label: "Leaf cleanup",
      prices: {
        light: {
          small: 35,
          medium: 50,
          large: 70,
        },
        moderate: {
          small: 50,
          medium: 75,
          large: 100,
        },
        heavy: {
          small: 75,
          medium: 110,
          large: 150,
        },
      },
    },

    mulching: {
      label: "Mulching",
      laborPerYard: 45,
      minimum: 75,
    },

    pressureWashing: {
      label: "Pressure washing",
      prices: {
        smallArea: 50,
        mediumArea: 85,
        largeArea: 125,
        driveway: 100,
      },
      highPrices: {
        driveway: 200,
      },
    },

    snowShoveling: {
      label: "Snow shoveling",
      manualNote: "Review needed - snow shoveling pricing will be finalized closer to winter.",
    },

    curbPainting: {
      label: "Curb painting",
      addOnPrice: 10,
      singlePrice: 15,
    },
  },

  lawnBundles: {
    mowBlow: {
      label: "Mow + blow",
      requiredServices: ["lawnMowing", "blowing"],
      prices: {
        small: 35,
        medium: 45,
        large: 55,
      },
    },

    mowEdgeBlow: {
      label: "Mow + edge + blow",
      requiredServices: ["lawnMowing", "edging", "blowing"],
      prices: {
        small: 40,
        medium: 50,
        large: 60,
      },
    },
  },

  propertySizes: {
    small: "Under 5,000 sq ft",
    medium: "5,000-10,000 sq ft",
    large: "10,000-15,000 sq ft",
    xlarge: "15,000+ sq ft",
  },
};

const serviceOptions = Object.entries(pricingTable.services).map(([key, service]) => ({
  key,
  label: service.label,
}));

const towns = ["River Edge", "Oradell", "Paramus"];

const yardSizes = [
  { key: "small", label: "Small", detail: pricingTable.propertySizes.small },
  { key: "medium", label: "Medium", detail: pricingTable.propertySizes.medium },
  { key: "large", label: "Large", detail: pricingTable.propertySizes.large },
  { key: "xlarge", label: "Extra large", detail: pricingTable.propertySizes.xlarge },
];

const leafAmounts = [
  { key: "light", label: "Light", detail: "Grass mostly visible" },
  { key: "moderate", label: "Moderate", detail: "Most of lawn covered" },
  { key: "heavy", label: "Heavy", detail: "Deep leaves, bagging, or multiple piles" },
];

const yesNoOptions = [
  { key: "yes", label: "Yes" },
  { key: "no", label: "No" },
  { key: "notSure", label: "Not sure" },
];

const mulchMaterialOptions = [
  { key: "yes", label: "Yes, I have mulch" },
  { key: "no", label: "No, I need material" },
  { key: "notSure", label: "Not sure yet" },
];

const mulchColors = [
  { key: "brown", label: "Brown" },
  { key: "black", label: "Black" },
  { key: "red", label: "Red" },
  { key: "natural", label: "Natural" },
  { key: "notSure", label: "Not sure" },
];

const pressureSurfaceOptions = [
  { key: "smallArea", label: "Small area", detail: "Walkway, small patio, or short section" },
  { key: "mediumArea", label: "Medium area", detail: "Patio, walkway set, or average section" },
  { key: "largeArea", label: "Large area", detail: "Large patio or larger surface" },
  { key: "driveway", label: "Driveway", detail: "Driveway wash" },
];

const snowServiceOptions = [
  { key: "walkway", label: "Walkway" },
  { key: "smallDriveway", label: "Small driveway" },
  { key: "mediumDriveway", label: "Medium driveway" },
  { key: "largeDriveway", label: "Large driveway" },
  { key: "walkwayDriveway", label: "Walkway + driveway" },
];

const detailServices = ["leafCleanup", "mulching", "pressureWashing", "snowShoveling"];
const lawnCareServices = ["lawnMowing", "blowing", "edging"];
const fullLawnBundleServices = ["lawnMowing", "blowing", "edging"];

const initialDetails = {
  town: "River Edge",
  size: "medium",
};

const initialReviewDetails = {
  customApproxSize: "",
  customFenced: "notSure",
  customObstacles: "notSure",
  leafAmount: "moderate",
  leafBagged: "notSure",
  leafCurb: "yes",
  leafPiles: "no",
  mulchColor: "brown",
  mulchHasMaterial: "notSure",
  mulchKnown: "notSure",
  mulchYards: "",
  pressureApproxSize: "",
  pressureDirty: "notSure",
  pressureSurface: "mediumArea",
  pressureWaterAccess: "notSure",
  snowSalt: "notSure",
  snowStairs: "no",
  snowType: "walkwayDriveway",
  snowWalkway: "yes",
};

function hasCustomLawnReview(services, details) {
  return details.size === "xlarge" && services.some((service) =>
    [...lawnCareServices, "leafCleanup"].includes(service),
  );
}

function needsReviewDetails(services, details) {
  return (
    services.some((service) => detailServices.includes(service)) ||
    hasCustomLawnReview(services, details)
  );
}

function getStepKeys(services, details) {
  return [
    "services",
    "basics",
    ...(needsReviewDetails(services, details) ? ["review"] : []),
    "estimate",
    "contact",
  ];
}

const stepLabels = {
  basics: "Basics",
  contact: "Contact",
  estimate: "Estimate",
  review: "Details",
  services: "Services",
};

function getEstimateType(services) {
  if (services.includes("snowShoveling") && services.length === 1) {
    return "Snow shoveling review";
  }

  if (services.some((service) => lawnCareServices.includes(service))) {
    return "Lawn care estimate";
  }

  if (services.includes("leafCleanup") || services.includes("mulching")) {
    return "Cleanup estimate";
  }

  if (services.includes("pressureWashing") || services.includes("curbPainting")) {
    return "Exterior service estimate";
  }

  return "Service estimate";
}

function canMoveForward(stepKey, services, details) {
  if (stepKey === "services") {
    return services.length > 0;
  }

  if (stepKey === "basics") {
    return details.town && details.size;
  }

  return true;
}

function getNextLabel(currentStep, stepKeys, stepIndex) {
  if (currentStep === "estimate") {
    return "Contact us";
  }

  if (stepKeys[stepIndex + 1] === "estimate") {
    return "Show estimate";
  }

  return "Next";
}

function formatPrice(value) {
  const rounded = Math.round(value * 100) / 100;

  return rounded % 1 === 0 ? `$${rounded.toFixed(0)}` : `$${rounded.toFixed(2)}`;
}

function getOptionLabel(options, key) {
  return options.find((option) => option.key === key)?.label || key;
}

function getServiceLabel(serviceKey) {
  return pricingTable.services[serviceKey]?.label || serviceKey;
}

function hasEveryService(services, requiredServices) {
  return requiredServices.every((service) => services.includes(service));
}

function getActiveLawnBundle(services) {
  if (hasEveryService(services, fullLawnBundleServices)) {
    return {
      key: "mowEdgeBlow",
      ...pricingTable.lawnBundles.mowEdgeBlow,
    };
  }

  if (hasEveryService(services, pricingTable.lawnBundles.mowBlow.requiredServices)) {
    return {
      key: "mowBlow",
      ...pricingTable.lawnBundles.mowBlow,
    };
  }

  return null;
}

function getLawnCareReviewNote(serviceKey, services, details) {
  if (details.size === "xlarge") {
    return "15,000+ sq ft lawns need a quick property review";
  }

  if (serviceKey === "lawnMowing") {
    return services.includes("edging")
      ? "Add blowing to use the mow + edge + blow estimate"
      : "Add blowing to use the mow + blow estimate";
  }

  if (serviceKey === "blowing") {
    return services.includes("lawnMowing")
      ? "Bundled when mowing is selected"
      : "Standalone blowing needs a quick review";
  }

  if (serviceKey === "edging") {
    return services.includes("lawnMowing")
      ? "Add blowing to use the mow + edge + blow estimate"
      : "Standalone edging needs a quick review";
  }

  return "Needs review";
}

function getLawnCareLineItems(services, details) {
  const selectedLawnServices = services.filter((service) => lawnCareServices.includes(service));

  if (!selectedLawnServices.length) {
    return [];
  }

  const activeBundle = getActiveLawnBundle(services);

  if (activeBundle) {
    if (details.size === "xlarge") {
      return [
        makeReviewItem(
          activeBundle.key,
          activeBundle.label,
          "15,000+ sq ft lawns need a quick property review",
        ),
      ];
    }

    return [
      {
        key: activeBundle.key,
        label: activeBundle.label,
        note: `${getOptionLabel(yardSizes, details.size)} lawn; bundle applied`,
        price: activeBundle.prices[details.size],
        startingAt: true,
      },
    ];
  }

  return selectedLawnServices.map((serviceKey) =>
    makeReviewItem(
      serviceKey,
      getServiceLabel(serviceKey),
      getLawnCareReviewNote(serviceKey, services, details),
    ),
  );
}

function makeReviewItem(key, label, note) {
  return {
    key,
    label,
    note,
    price: null,
    reviewNeeded: true,
  };
}

function formatLineItemPrice(item) {
  if (item.price === null || item.price === undefined) {
    return "Review needed";
  }

  if (item.highPrice) {
    return `${formatPrice(item.price)}-${formatPrice(item.highPrice)}`;
  }

  if (item.plus) {
    return `Around ${formatPrice(item.price)}+`;
  }

  return item.startingAt ? `Around ${formatPrice(item.price)}` : formatPrice(item.price);
}

function getPriceEstimate(services, details, reviewDetails) {
  const lineItems = [
    ...getLawnCareLineItems(services, details),
    ...services.filter((serviceKey) => !lawnCareServices.includes(serviceKey)).map((serviceKey) => {
    const service = pricingTable.services[serviceKey];

    if (serviceKey === "leafCleanup") {
      if (details.size === "xlarge") {
        return makeReviewItem(
          serviceKey,
          service.label,
          "15,000+ sq ft leaf cleanup needs review",
        );
      }

      const amount = reviewDetails.leafAmount || "moderate";
      const price = service.prices[amount][details.size];
      const isHeavy = amount === "heavy";

      return {
        key: serviceKey,
        label: service.label,
        note: `${getOptionLabel(leafAmounts, amount)} coverage`,
        plus: isHeavy && details.size === "large",
        price,
        reviewNeeded: isHeavy,
        startingAt: true,
      };
    }

    if (serviceKey === "mulching") {
      const yards = Number(reviewDetails.mulchYards);

      if (reviewDetails.mulchKnown !== "yes" || !yards || yards <= 0) {
        return makeReviewItem(
          serviceKey,
          service.label,
          "Cubic yards or bed size needed before pricing",
        );
      }

      return {
        key: serviceKey,
        label: service.label,
        note: `${yards} cu yd labor only; mulch/material separate`,
        price: Math.max(service.minimum, yards * service.laborPerYard),
        startingAt: true,
      };
    }

    if (serviceKey === "pressureWashing") {
      const surface = reviewDetails.pressureSurface || "mediumArea";
      const price = service.prices[surface];
      const highPrice = service.highPrices[surface];

      return {
        key: serviceKey,
        label: service.label,
        highPrice,
        note: `${getOptionLabel(pressureSurfaceOptions, surface)}; surface, dirt, and water access may change price`,
        plus: surface === "largeArea",
        price,
        reviewNeeded: true,
        startingAt: true,
      };
    }

    if (serviceKey === "snowShoveling") {
      return makeReviewItem(serviceKey, service.label, service.manualNote);
    }

    if (serviceKey === "curbPainting") {
      const isAddOn = services.length > 1;

      return {
        key: serviceKey,
        label: service.label,
        note: isAddOn ? "add-on to another service" : "single curb",
        price: isAddOn ? service.addOnPrice : service.singlePrice,
      };
    }

    return makeReviewItem(serviceKey, getServiceLabel(serviceKey), "Needs review");
  }),
  ];

  const pricedItems = lineItems.filter((item) => typeof item.price === "number");
  const startingTotal = pricedItems.reduce((sum, item) => sum + item.price, 0);
  const hasPricedItems = pricedItems.length > 0;
  const hasReviewNeeded = lineItems.some((item) => item.reviewNeeded);
  const hasPlusOrRange = lineItems.some((item) => item.plus || item.highPrice);

  return {
    displayTotal: hasPricedItems
      ? `Around ${formatPrice(startingTotal)}${hasPlusOrRange || hasReviewNeeded ? "+" : ""}`
      : "Review needed",
    hasPricedItems,
    lineItems,
    note: "Final pricing may vary based on property size, condition, access, and service details.",
    period: hasPricedItems ? "rough estimate" : "manual review",
    reviewNeeded: hasReviewNeeded || !hasPricedItems,
    startingTotal,
  };
}

function getReviewSummaryLines(services, details, reviewDetails) {
  const lines = [];

  if (services.includes("leafCleanup")) {
    lines.push(`Leaf amount: ${getOptionLabel(leafAmounts, reviewDetails.leafAmount)}`);
    lines.push(`Leaves need bagging: ${getOptionLabel(yesNoOptions, reviewDetails.leafBagged)}`);
    lines.push(`Can leave at curb: ${getOptionLabel(yesNoOptions, reviewDetails.leafCurb)}`);
    lines.push(`Large piles already made: ${getOptionLabel(yesNoOptions, reviewDetails.leafPiles)}`);
  }

  if (services.includes("mulching")) {
    lines.push(`Knows cubic yards: ${getOptionLabel(yesNoOptions, reviewDetails.mulchKnown)}`);
    lines.push(`Cubic yards/bed size: ${reviewDetails.mulchYards || "Not sure"}`);
    lines.push(`Customer has mulch: ${getOptionLabel(mulchMaterialOptions, reviewDetails.mulchHasMaterial)}`);
    lines.push(`Preferred mulch color: ${getOptionLabel(mulchColors, reviewDetails.mulchColor)}`);
  }

  if (services.includes("pressureWashing")) {
    lines.push(`Pressure washing surface: ${getOptionLabel(pressureSurfaceOptions, reviewDetails.pressureSurface)}`);
    lines.push(`Approximate size: ${reviewDetails.pressureApproxSize || "Not sure"}`);
    lines.push(`Outdoor water access: ${getOptionLabel(yesNoOptions, reviewDetails.pressureWaterAccess)}`);
    lines.push(`Heavy staining/algae/dirt: ${getOptionLabel(yesNoOptions, reviewDetails.pressureDirty)}`);
  }

  if (services.includes("snowShoveling")) {
    lines.push(`Snow service type: ${getOptionLabel(snowServiceOptions, reviewDetails.snowType)}`);
    lines.push(`Walkway included: ${getOptionLabel(yesNoOptions, reviewDetails.snowWalkway)}`);
    lines.push(`Stairs included: ${getOptionLabel(yesNoOptions, reviewDetails.snowStairs)}`);
    lines.push(`Salt needed: ${getOptionLabel(yesNoOptions, reviewDetails.snowSalt)}`);
  }

  if (hasCustomLawnReview(services, details)) {
    lines.push(`Approximate lawn size: ${reviewDetails.customApproxSize || "15,000+ sq ft"}`);
    lines.push(`Yard fenced: ${getOptionLabel(yesNoOptions, reviewDetails.customFenced)}`);
    lines.push(`Hills, obstacles, or tight areas: ${getOptionLabel(yesNoOptions, reviewDetails.customObstacles)}`);
  }

  return lines;
}

export default function EstimateWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [details, setDetails] = useState(initialDetails);
  const [reviewDetails, setReviewDetails] = useState(initialReviewDetails);
  const [copiedTarget, setCopiedTarget] = useState(null);

  const stepKeys = getStepKeys(selectedServices, details);
  const safeStep = Math.min(step, stepKeys.length - 1);
  const currentStep = stepKeys[safeStep] || "services";
  const estimateType = getEstimateType(selectedServices);
  const canContinue = canMoveForward(currentStep, selectedServices, details);
  const priceEstimate = getPriceEstimate(selectedServices, details, reviewDetails);
  const selectedServiceLabels = selectedServices.map(getServiceLabel);
  const reviewSummaryLines = getReviewSummaryLines(selectedServices, details, reviewDetails);
  const activeLawnBundle = getActiveLawnBundle(selectedServices);
  const hasLawnCareSelected = selectedServices.some((service) => lawnCareServices.includes(service));
  const fullLawnBundleSelected = hasEveryService(selectedServices, fullLawnBundleServices);

  const emailBody = [
    "Estimate follow-up",
    "",
    `Estimated around: ${priceEstimate.displayTotal}`,
    `Review needed: ${priceEstimate.reviewNeeded ? "Yes" : "No"}`,
    `Estimate type: ${estimateType}`,
    `Town: ${details.town}`,
    `Lawn size: ${getOptionLabel(yardSizes, details.size)} (${pricingTable.propertySizes[details.size]})`,
    `Services: ${selectedServiceLabels.join(", ")}`,
    ...(reviewSummaryLines.length ? ["", "Service details:", ...reviewSummaryLines] : []),
    "",
    `Line items: ${priceEstimate.lineItems
      .map((item) => `${item.label} ${formatLineItemPrice(item)} (${item.note})`)
      .join("; ")}`,
    `Note: ${priceEstimate.note}`,
    "",
    "Please confirm pricing and next steps.",
  ].join("\n");

  const emailHref = `mailto:hello@gardenstategreenery.co?subject=${encodeURIComponent(
    "Estimate request - Garden State Greenery",
  )}&body=${encodeURIComponent(emailBody)}`;

  function toggleService(service) {
    setSelectedServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    );
  }

  function addMowingBundle() {
    setSelectedServices((current) =>
      Array.from(new Set([...current, ...fullLawnBundleServices])),
    );
  }

  function updateDetails(key, value) {
    setDetails((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateReviewDetails(key, value) {
    setReviewDetails((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function closeWizard() {
    setIsOpen(false);
  }

  function openWizard() {
    setStep(0);
    setIsOpen(true);
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeWizard();
    }
  }

  async function copyEmailSummary(target) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(emailBody);
      } else {
        const textArea = document.createElement("textarea");

        textArea.value = emailBody;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopiedTarget(target);
      window.setTimeout(() => {
        setCopiedTarget((current) => (current === target ? null : current));
      }, 1800);
    } catch {
      setCopiedTarget("error");
      window.setTimeout(() => {
        setCopiedTarget((current) => (current === "error" ? null : current));
      }, 1800);
    }
  }

  return (
    <>
      <button
        className="button button-primary estimate-wizard-trigger"
        type="button"
        onClick={openWizard}
      >
        Receive an estimate
      </button>

      {isOpen ? (
        <div
          className="estimate-modal-backdrop"
          role="presentation"
          onMouseDown={handleBackdropClick}
        >
          <section
            className="estimate-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="estimate-wizard-title"
          >
            <div className="estimate-modal-head">
              <div>
                <span className="mini-label">Estimate Wizard</span>
                <h3 id="estimate-wizard-title">Pick what you need and get a rough estimate.</h3>
              </div>
              <button className="estimate-modal-close" type="button" onClick={closeWizard}>
                Close
              </button>
            </div>

            <div
              className="wizard-steps"
              aria-label="Estimate steps"
              style={{ "--wizard-step-count": stepKeys.length }}
            >
              {stepKeys.map((item, index) => (
                <span
                  className={`wizard-step${index === safeStep ? " is-active" : ""}${
                    index < safeStep ? " is-complete" : ""
                  }`}
                  key={item}
                >
                  {stepLabels[item]}
                </span>
              ))}
            </div>

            <div className="wizard-body" key={currentStep}>
              {currentStep === "services" ? (
                <div className="wizard-panel">
                  <h4>What do you need handled?</h4>
                  <div className="wizard-choice-grid">
                    {serviceOptions.map((service) => (
                      <label
                        className={`wizard-choice${
                          selectedServices.includes(service.key) ? " is-selected" : ""
                        }`}
                        key={service.key}
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.key)}
                          onChange={() => toggleService(service.key)}
                        />
                        <span>{service.label}</span>
                      </label>
                    ))}
                  </div>
                  {hasLawnCareSelected ? (
                    <div className={`wizard-bundle-note ${
                      fullLawnBundleSelected ? "is-complete" : "is-active"
                    }`}>
                      <div>
                        <span className="mini-label">Mowing bundle</span>
                        <p>
                          {fullLawnBundleSelected
                            ? "Mow + edge + blow pricing is applied automatically."
                            : activeLawnBundle?.key === "mowBlow"
                              ? "Mow + blow pricing is active. Add edging for the full lawn-care bundle."
                              : "Add mowing, blowing, and edging together for the bundled estimate."}
                        </p>
                      </div>
                      {fullLawnBundleSelected ? (
                        <strong>Bundle added</strong>
                      ) : (
                        <button type="button" onClick={addMowingBundle}>
                          Add bundle
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="wizard-bundle-note">
                      <div>
                        <span className="mini-label">Rough prices</span>
                        <p>
                          Quick jobs show around what it may cost. Bigger lawns, heavy leaves,
                          snow, and detail-heavy work get reviewed before the final quote.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {currentStep === "basics" ? (
                <div className="wizard-panel">
                  <h4>Where is the job?</h4>
                  <div className="wizard-field-grid">
                    <label>
                      Town
                      <select
                        value={details.town}
                        onChange={(event) => updateDetails("town", event.target.value)}
                      >
                        {towns.map((town) => (
                          <option key={town}>{town}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Lawn size
                      <select
                        value={details.size}
                        onChange={(event) => updateDetails("size", event.target.value)}
                      >
                        {yardSizes.map((size) => (
                          <option key={size.key} value={size.key}>
                            {size.label} ({size.detail})
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              ) : null}

              {currentStep === "review" ? (
                <div className="wizard-panel">
                  <h4>A few details help keep the estimate honest.</h4>
                  <div className="wizard-review-stack">
                    {selectedServices.includes("leafCleanup") ? (
                      <section className="wizard-review-section">
                        <h5>Leaf cleanup</h5>
                        <div className="wizard-field-grid">
                          <label>
                            Leaf amount
                            <select
                              value={reviewDetails.leafAmount}
                              onChange={(event) => updateReviewDetails("leafAmount", event.target.value)}
                            >
                              {leafAmounts.map((amount) => (
                                <option key={amount.key} value={amount.key}>
                                  {amount.label} ({amount.detail})
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Need bagging?
                            <select
                              value={reviewDetails.leafBagged}
                              onChange={(event) => updateReviewDetails("leafBagged", event.target.value)}
                            >
                              {yesNoOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Can leave at curb?
                            <select
                              value={reviewDetails.leafCurb}
                              onChange={(event) => updateReviewDetails("leafCurb", event.target.value)}
                            >
                              {yesNoOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Large piles already made?
                            <select
                              value={reviewDetails.leafPiles}
                              onChange={(event) => updateReviewDetails("leafPiles", event.target.value)}
                            >
                              {yesNoOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </section>
                    ) : null}

                    {selectedServices.includes("mulching") ? (
                      <section className="wizard-review-section">
                        <h5>Mulching</h5>
                        <div className="wizard-field-grid">
                          <label>
                            Know cubic yards?
                            <select
                              value={reviewDetails.mulchKnown}
                              onChange={(event) => updateReviewDetails("mulchKnown", event.target.value)}
                            >
                              {yesNoOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Cubic yards / bed size
                            <input
                              type="text"
                              value={reviewDetails.mulchYards}
                              placeholder="Example: 2 or front beds"
                              onChange={(event) => updateReviewDetails("mulchYards", event.target.value)}
                            />
                          </label>
                          <label>
                            Do you have mulch?
                            <select
                              value={reviewDetails.mulchHasMaterial}
                              onChange={(event) => updateReviewDetails("mulchHasMaterial", event.target.value)}
                            >
                              {mulchMaterialOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Mulch color
                            <select
                              value={reviewDetails.mulchColor}
                              onChange={(event) => updateReviewDetails("mulchColor", event.target.value)}
                            >
                              {mulchColors.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </section>
                    ) : null}

                    {selectedServices.includes("pressureWashing") ? (
                      <section className="wizard-review-section">
                        <h5>Pressure washing</h5>
                        <div className="wizard-field-grid">
                          <label>
                            Surface
                            <select
                              value={reviewDetails.pressureSurface}
                              onChange={(event) => updateReviewDetails("pressureSurface", event.target.value)}
                            >
                              {pressureSurfaceOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                  {option.label} ({option.detail})
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Approximate size
                            <input
                              type="text"
                              value={reviewDetails.pressureApproxSize}
                              placeholder="Example: 2-car driveway"
                              onChange={(event) => updateReviewDetails("pressureApproxSize", event.target.value)}
                            />
                          </label>
                          <label>
                            Outdoor water access?
                            <select
                              value={reviewDetails.pressureWaterAccess}
                              onChange={(event) => updateReviewDetails("pressureWaterAccess", event.target.value)}
                            >
                              {yesNoOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Heavy staining?
                            <select
                              value={reviewDetails.pressureDirty}
                              onChange={(event) => updateReviewDetails("pressureDirty", event.target.value)}
                            >
                              {yesNoOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </section>
                    ) : null}

                    {selectedServices.includes("snowShoveling") ? (
                      <section className="wizard-review-section">
                        <h5>Snow shoveling</h5>
                        <p className="wizard-field-note">
                          Review needed - snow shoveling pricing will be finalized closer to winter.
                        </p>
                        <div className="wizard-field-grid">
                          <label>
                            Service type
                            <select
                              value={reviewDetails.snowType}
                              onChange={(event) => updateReviewDetails("snowType", event.target.value)}
                            >
                              {snowServiceOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Walkway included?
                            <select
                              value={reviewDetails.snowWalkway}
                              onChange={(event) => updateReviewDetails("snowWalkway", event.target.value)}
                            >
                              {yesNoOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Stairs included?
                            <select
                              value={reviewDetails.snowStairs}
                              onChange={(event) => updateReviewDetails("snowStairs", event.target.value)}
                            >
                              {yesNoOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Salt needed?
                            <select
                              value={reviewDetails.snowSalt}
                              onChange={(event) => updateReviewDetails("snowSalt", event.target.value)}
                            >
                              {yesNoOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </section>
                    ) : null}

                    {hasCustomLawnReview(selectedServices, details) ? (
                      <section className="wizard-review-section">
                        <h5>Extra large lawn</h5>
                        <div className="wizard-field-grid">
                          <label>
                            Approximate lawn size
                            <input
                              type="text"
                              value={reviewDetails.customApproxSize}
                              placeholder="Example: 18,000 sq ft"
                              onChange={(event) => updateReviewDetails("customApproxSize", event.target.value)}
                            />
                          </label>
                          <label>
                            Fenced yard?
                            <select
                              value={reviewDetails.customFenced}
                              onChange={(event) => updateReviewDetails("customFenced", event.target.value)}
                            >
                              {yesNoOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Hills or obstacles?
                            <select
                              value={reviewDetails.customObstacles}
                              onChange={(event) => updateReviewDetails("customObstacles", event.target.value)}
                            >
                              {yesNoOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </section>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {currentStep === "estimate" ? (
                <div className="wizard-panel estimate-result">
                  <span className="mini-label">Price estimate</span>
                  <div className="estimate-receipt">
                    <div className="estimate-receipt-head">
                      <div>
                        <strong>Garden State Greenery</strong>
                        <span>{estimateType}</span>
                      </div>
                      <small>Starting price</small>
                    </div>
                    <div className="estimate-summary">
                      <p>
                        <strong>Services</strong>
                        {selectedServiceLabels.join(", ")}
                      </p>
                      <p>
                        <strong>Town</strong>
                        {details.town}
                      </p>
                      <p>
                        <strong>Lawn size</strong>
                        {getOptionLabel(yardSizes, details.size)} ({pricingTable.propertySizes[details.size]})
                      </p>
                      {priceEstimate.reviewNeeded ? (
                        <p>
                          <strong>Review</strong>
                          <span className="estimate-review-badge">Review needed</span>
                        </p>
                      ) : null}
                    </div>
                    <div className="estimate-line-items">
                      {priceEstimate.lineItems.map((item) => (
                        <p key={item.key}>
                          <span>
                            <strong>{item.label}</strong>
                            <small>{item.note}</small>
                          </span>
                          <b>{formatLineItemPrice(item)}</b>
                        </p>
                      ))}
                    </div>
                    <div className="estimate-receipt-total">
                      <span>{priceEstimate.period}</span>
                      <strong>{priceEstimate.displayTotal}</strong>
                    </div>
                    {priceEstimate.reviewNeeded && reviewSummaryLines.length ? (
                      <div className="estimate-review-flags">
                        {reviewSummaryLines.slice(0, 5).map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </div>
                    ) : null}
                    <div className="estimate-receipt-footer">
                      <p className="estimate-result-note">{priceEstimate.note}</p>
                      <button
                        className="estimate-receipt-copy"
                        type="button"
                        onClick={() => copyEmailSummary("estimate")}
                      >
                        {copiedTarget === "estimate"
                          ? "Copied"
                          : copiedTarget === "error"
                            ? "Copy failed"
                            : "Copy summary"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {currentStep === "contact" ? (
                <div className="wizard-panel wizard-contact-panel">
                  <span className="mini-label">Get in touch</span>
                  <h4>Send this over and we can confirm the details.</h4>
                  <p className="estimate-result-note">
                    {priceEstimate.hasPricedItems
                      ? `${priceEstimate.displayTotal} is the rough estimate.`
                      : "This request needs a quick review before pricing."}{" "}
                    Send the address and anything we should know about access or problem spots.
                  </p>
                  <div className="wizard-contact-details">
                    <p>
                      <strong>Call or text</strong>
                      732-301-6721
                    </p>
                    <p>
                      <strong>Email</strong>
                      hello@gardenstategreenery.co
                    </p>
                  </div>
                  <div className="wizard-contact-actions">
                    <a className="button button-primary" href={emailHref}>
                      Email summary
                    </a>
                    <a className="button button-secondary estimate-call-button" href="tel:+17323016721">
                      Call or text
                    </a>
                    <button
                      className="button estimate-copy-button estimate-contact-copy-button"
                      type="button"
                      onClick={() => copyEmailSummary("contact")}
                    >
                      {copiedTarget === "contact"
                        ? "Copied"
                        : copiedTarget === "error"
                          ? "Copy failed"
                          : "Copy summary"}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="wizard-actions">
              <button
                className="button wizard-ghost-button"
                type="button"
                onClick={() => (safeStep === 0 ? closeWizard() : setStep(safeStep - 1))}
              >
                {safeStep === 0 ? "Cancel" : "Back"}
              </button>
              {safeStep < stepKeys.length - 1 ? (
                <button
                  className="button button-primary"
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep(safeStep + 1)}
                >
                  {getNextLabel(currentStep, stepKeys, safeStep)}
                </button>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
