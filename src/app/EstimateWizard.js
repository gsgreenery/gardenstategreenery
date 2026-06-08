"use client";

import { useEffect, useState } from "react";

export const pricingTable = {
  services: {
    lawnMowing: {
      label: "Lawn mowing",
      prices: {
        small: 50,
        medium: 65,
        large: 85,
        xlarge: 110,
      },
    },

    blowing: {
      label: "Blowing",
      prices: {
        small: 20,
        medium: 25,
        large: 35,
        xlarge: 45,
      },
      discountedWithMowing: {
        small: 10,
        medium: 15,
        large: 20,
        xlarge: 25,
      },
    },

    edging: {
      label: "Edging",
      prices: {
        small: 20,
        medium: 25,
        large: 35,
        xlarge: 45,
      },
      discountedWithMowing: {
        small: 10,
        medium: 15,
        large: 20,
        xlarge: 25,
      },
    },

    mulching: {
      label: "Mulching",
      prices: {
        small: 100,
        medium: 200,
        large: 350,
        xlarge: 500,
      },
    },

    leafCleanup: {
      label: "Raking / leaf cleanup",
      prices: {
        small: 75,
        medium: 125,
        large: 200,
        xlarge: 300,
      },
    },

    snowShoveling: {
      label: "Snow shoveling",
      prices: {
        small: 35,
        medium: 50,
        large: 75,
        xlarge: 100,
      },
    },
  },

  modifiers: {
    lawnCondition: {
      maintained: 0,
      slightlyOvergrown: 20,
      veryOvergrown: 50,
    },

    frequency: {
      weekly: -0.1,
      everyOtherWeek: 0,
      oneTime: 0.2,
    },

    timing: {
      flexible: 0,
      specificDay: 10,
      urgent: 25,
    },
  },

  propertySizes: {
    small: "< 3,000 sq ft",
    medium: "3,000 - 6,000 sq ft",
    large: "6,000 - 10,000 sq ft",
    xlarge: "10,000+ sq ft",
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

const lawnConditions = [
  { key: "maintained", label: "Maintained" },
  { key: "slightlyOvergrown", label: "Slightly overgrown" },
  { key: "veryOvergrown", label: "Very overgrown" },
];

const frequencies = [
  { key: "weekly", label: "Weekly" },
  { key: "everyOtherWeek", label: "Every other week" },
  { key: "oneTime", label: "One-time" },
];

const timingOptions = [
  { key: "flexible", label: "Flexible" },
  { key: "specificDay", label: "Specific day" },
  { key: "urgent", label: "Urgent" },
];

const frequencyServiceKeys = ["lawnMowing", "blowing", "edging"];

const initialDetails = {
  town: "River Edge",
  size: "medium",
  condition: "maintained",
  frequency: "oneTime",
  timing: "flexible",
};

function getEstimateType(services, frequency) {
  if (services.includes("snowShoveling") && services.length <= 2) {
    return "Winter access estimate";
  }

  if (services.includes("mulching") || services.includes("leafCleanup")) {
    return "Cleanup estimate";
  }

  if (services.includes("lawnMowing") && frequency !== "oneTime") {
    return "Regular mowing estimate";
  }

  if (services.length >= 4) {
    return "Full yard visit estimate";
  }

  return "One-time visit estimate";
}

function canMoveForward(step, services, details) {
  if (step === 0) {
    return services.length > 0;
  }

  if (step === 1) {
    return details.town && details.size && details.condition && details.frequency && details.timing;
  }

  return true;
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

function getPriceEstimate(services, details) {
  const hasMowing = services.includes("lawnMowing");
  const frequencyModifier = pricingTable.modifiers.frequency[details.frequency] || 0;
  const lineItems = services.map((serviceKey) => {
    const service = pricingTable.services[serviceKey];
    const usesMowingDiscount =
      hasMowing &&
      (serviceKey === "blowing" || serviceKey === "edging") &&
      service.discountedWithMowing;
    const basePrice = usesMowingDiscount
      ? service.discountedWithMowing[details.size]
      : service.prices[details.size];
    const appliesFrequency = frequencyServiceKeys.includes(serviceKey);
    const adjustedPrice = appliesFrequency
      ? basePrice * (1 + frequencyModifier)
      : basePrice;

    return {
      key: serviceKey,
      label: service.label,
      note: usesMowingDiscount ? "discounted with mowing" : "standalone",
      price: adjustedPrice,
    };
  });
  const modifiers = [];

  if (hasMowing) {
    const conditionPrice = pricingTable.modifiers.lawnCondition[details.condition] || 0;

    if (conditionPrice) {
      modifiers.push({
        key: "lawnCondition",
        label: "Lawn condition",
        note: getOptionLabel(lawnConditions, details.condition),
        price: conditionPrice,
      });
    }
  }

  const timingPrice = pricingTable.modifiers.timing[details.timing] || 0;

  if (timingPrice) {
    modifiers.push({
      key: "timing",
      label: "Timing",
      note: getOptionLabel(timingOptions, details.timing),
      price: timingPrice,
    });
  }

  const total = [...lineItems, ...modifiers].reduce((sum, item) => sum + item.price, 0);
  const low = Math.max(0, total * 0.9);
  const high = Math.max(low, total * 1.1);

  return {
    total,
    low,
    high,
    range: `${formatPrice(low)} - ${formatPrice(high)}`,
    period: "rough range",
    lineItems,
    modifiers,
    note: "Final quote may vary after property review.",
  };
}

function getNextLabel(step) {
  if (step === 1) {
    return "Show estimate";
  }

  if (step === 2) {
    return "Contact us";
  }

  return "Next";
}

export default function EstimateWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileWizard, setIsMobileWizard] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [details, setDetails] = useState(initialDetails);
  const [copiedTarget, setCopiedTarget] = useState(null);

  const estimateType = getEstimateType(selectedServices, details.frequency);
  const canContinue = canMoveForward(step, selectedServices, details);
  const hasMowing = selectedServices.includes("lawnMowing");
  const hasFrequencyPricedService = selectedServices.some((service) =>
    frequencyServiceKeys.includes(service),
  );
  const hasMowingBundle =
    hasMowing && selectedServices.includes("blowing") && selectedServices.includes("edging");
  const priceEstimate = getPriceEstimate(selectedServices, details);
  const selectedServiceLabels = selectedServices.map(getServiceLabel);
  const estimateItems = [...priceEstimate.lineItems, ...priceEstimate.modifiers];
  const bundleLabel = isMobileWizard
    ? "Mowing bundle (discount available)"
    : "Mowing add-ons";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 520px)");
    const updateMobileState = () => setIsMobileWizard(mediaQuery.matches);

    updateMobileState();
    mediaQuery.addEventListener("change", updateMobileState);

    return () => mediaQuery.removeEventListener("change", updateMobileState);
  }, []);

  const emailBody = [
    "Estimate follow-up",
    "",
    `Estimated range: ${priceEstimate.range} (${priceEstimate.period})`,
    `Estimate type: ${estimateType}`,
    `Town: ${details.town}`,
    `Property size: ${getOptionLabel(yardSizes, details.size)} (${pricingTable.propertySizes[details.size]})`,
    ...(hasMowing
      ? [`Lawn condition: ${getOptionLabel(lawnConditions, details.condition)}`]
      : []),
    `Timing: ${getOptionLabel(timingOptions, details.timing)}`,
    ...(hasFrequencyPricedService
      ? [`Frequency: ${getOptionLabel(frequencies, details.frequency)}`]
      : []),
    `Services: ${selectedServiceLabels.join(", ")}`,
    `Line items: ${estimateItems
      .map((item) => `${item.label} ${formatPrice(item.price)} (${item.note})`)
      .join("; ")}`,
    `Note: ${priceEstimate.note}`,
    "",
    "Please confirm the price and next steps when you can.",
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
    setSelectedServices((current) => {
      const bundledServices = ["lawnMowing", "blowing", "edging"];

      return bundledServices.reduce(
        (services, service) => (services.includes(service) ? services : [...services, service]),
        current,
      );
    });
  }

  function updateDetails(key, value) {
    setDetails((current) => ({
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
                <h3 id="estimate-wizard-title">Pick what you need and get a rough price.</h3>
              </div>
              <button className="estimate-modal-close" type="button" onClick={closeWizard}>
                Close
              </button>
            </div>

            <div className="wizard-steps" aria-label="Estimate steps">
              {["Services", "Details", "Estimate", "Contact"].map((item, index) => (
                <span
                  className={`wizard-step${index === step ? " is-active" : ""}${
                    index < step ? " is-complete" : ""
                  }`}
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="wizard-body" key={step}>
              {step === 0 ? (
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
                  <div
                    className={`wizard-bundle-note${hasMowing ? " is-active" : ""}${
                      hasMowingBundle ? " is-complete" : ""
                    }`}
                  >
                    <div>
                      <span className="mini-label">{bundleLabel}</span>
                      <p>
                        {hasMowing
                          ? "If you're adding mowing, blowing and edging use the lower visit price."
                          : "Pick lawn mowing first if you want the lower add-on price for blowing and edging."}
                      </p>
                    </div>
                    {hasMowingBundle ? (
                      <strong>Bundle selected</strong>
                    ) : hasMowing ? (
                      <button type="button" onClick={addMowingBundle}>
                        Add both
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="wizard-panel">
                  <h4>Where and how often?</h4>
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
                      Property size
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
                    <label>
                      Lawn condition
                      <select
                        value={details.condition}
                        disabled={!hasMowing}
                        onChange={(event) => updateDetails("condition", event.target.value)}
                      >
                        {lawnConditions.map((condition) => (
                          <option key={condition.key} value={condition.key}>
                            {condition.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Timing
                      <select
                        value={details.timing}
                        onChange={(event) => updateDetails("timing", event.target.value)}
                      >
                        {timingOptions.map((timing) => (
                          <option key={timing.key} value={timing.key}>
                            {timing.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Frequency
                      <select
                        value={details.frequency}
                        disabled={!hasFrequencyPricedService}
                        onChange={(event) => updateDetails("frequency", event.target.value)}
                      >
                        {frequencies.map((frequency) => (
                          <option key={frequency.key} value={frequency.key}>
                            {frequency.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="wizard-panel estimate-result">
                  <span className="mini-label">Price estimate</span>
                  <div className="estimate-receipt">
                    <div className="estimate-receipt-head">
                      <div>
                        <strong>Garden State Greenery</strong>
                        <span>{estimateType}</span>
                      </div>
                      <small>Rough price</small>
                    </div>
                    <div className="estimate-summary">
                      <p>
                        <strong>Services</strong>
                        {selectedServiceLabels.join(", ")}
                      </p>
                      <p>
                        <strong>Property</strong>
                        {getOptionLabel(yardSizes, details.size)} yard in {details.town}
                      </p>
                      {hasMowing ? (
                        <p>
                          <strong>Condition</strong>
                          {getOptionLabel(lawnConditions, details.condition)}
                        </p>
                      ) : null}
                      <p>
                        <strong>Timing</strong>
                        {getOptionLabel(timingOptions, details.timing)}
                      </p>
                      {hasFrequencyPricedService ? (
                        <p>
                          <strong>Frequency</strong>
                          {getOptionLabel(frequencies, details.frequency)}
                        </p>
                      ) : null}
                    </div>
                    <div className="estimate-line-items">
                      {estimateItems.map((item) => (
                        <p key={item.key}>
                          <span>
                            <strong>{item.label}</strong>
                            <small>{item.note}</small>
                          </span>
                          <b>{formatPrice(item.price)}</b>
                        </p>
                      ))}
                    </div>
                    <div className="estimate-receipt-total">
                      <span>{priceEstimate.period}</span>
                      <strong>{priceEstimate.range}</strong>
                    </div>
                    <div className="estimate-receipt-footer">
                      <p className="estimate-result-note">
                        Final quote may vary after property review.
                      </p>
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

              {step === 3 ? (
                <div className="wizard-panel wizard-contact-panel">
                  <span className="mini-label">Get in touch</span>
                  <h4>Send this over and we can confirm the details.</h4>
                  <p className="estimate-result-note">
                    Your estimate is {priceEstimate.range}. Send the address,
                    a couple photos, and anything we should know about access
                    or problem spots.
                  </p>
                  <div className="wizard-contact-details">
                    <p>
                      <strong>Call or text</strong>
                      551.502.2099
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
                    <a className="button button-secondary estimate-call-button" href="tel:+15515022099">
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
                onClick={() => (step === 0 ? closeWizard() : setStep((current) => current - 1))}
              >
                {step === 0 ? "Cancel" : "Back"}
              </button>
              {step < 3 ? (
                <button
                  className="button button-primary"
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep((current) => current + 1)}
                >
                  {getNextLabel(step)}
                </button>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
