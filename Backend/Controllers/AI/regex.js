const contactRegex =
  /(?:contact[-\s]?(?:us|form|page|info|information|details|support|sales|team|now|here|today)?|get[-\s](?:in[-\s]touch|connected)|reach[-\s](?:us|out)|connect[-\s](?:with[-\s]us|now)|support[-\s](?:center|desk)|help[-\s]desk|enquiry|inquiry|feedback|write[-\s]to[-\s]us|message[-\s]us|talk[-\s]to[-\s]us|let\'s[-\s]talk|customer[-\s](?:service|support|care)|technical[-\s]support|sales[-\s](?:inquiry|team)|locations?|offices?|branches?|where[-\s](?:to[-\s]find[-\s]us|we[-\s]are)|visit[-\s]us)/i;

const businessRegex =
  /(?:about[-\s]?(?:us|company|team|business|organization|firm|group|leadership|management|story|history|values|culture|philosophy|approach|experience|expertise|people)?|company[-\s](?:profile|info|overview|history|background)|who[-\s](?:we[-\s]are|are[-\s]we)|our[-\s](?:story|mission|vision|values|philosophy|approach|team|leadership|management|people|culture|history|journey|commitment|excellence|quality|difference|advantage|expertise|experience)|corporate[-\s](?:info|profile|overview|governance|responsibility|values)|meet[-\s](?:the[-\s]team|our[-\s]team)|leadership[-\s]team|executive[-\s]team|management[-\s]team|team[-\s]members?|what[-\s]we[-\s]do|why[-\s](?:choose[-\s]us|us)|heritage|legacy|milestones|achievements)/i;

// const productsRegex = /products|services|products-and-services/i;
const productsRegex =
  /(?:products?(?:[-\s](?:and|&)[-\s]services?)?|services?|solutions?|offerings?|merchandise|goods|items?|supplies|equipment|tools?|accessories|parts?|components?|systems?|packages?|bundles?|kits?|collections?|catalogs?|inventory|stock|product[-\s]line|service[-\s]offerings?|business[-\s]solutions?|enterprise[-\s]solutions?|professional[-\s]services?|consulting[-\s]services?|managed[-\s]services?|support[-\s]services?|maintenance[-\s]services?|repair[-\s]services?|installation[-\s]services?|technical[-\s]services?|cloud[-\s]services?|digital[-\s]services?|online[-\s]services?|products?[-\s]portfolio|service[-\s]portfolio|business[-\s]portfolio|solutions?[-\s]portfolio|product[-\s]catalog|service[-\s]catalog|product[-\s]range|service[-\s]range|product[-\s]suite|service[-\s]suite|solutions?[-\s]suite|business[-\s]suite|enterprise[-\s]suite|product[-\s]offering|service[-\s]offering|solutions?[-\s]offering|business[-\s]offering|enterprise[-\s]offering)/i;

const serviceRegex =
  /(?:services?(?:[-\s](?:overview|details|list|catalog|directory|options|packages|plans|pricing|features|benefits|offerings|solutions))?|our[-\s]services?|service[-\s](?:area|coverage|description|portfolio|capabilities|expertise|specialties|specialization|categories|types|packages|plans|options|solutions)|professional[-\s]services?|managed[-\s]services?|consulting[-\s]services?|technical[-\s]services?|support[-\s]services?|maintenance[-\s]services?|repair[-\s]services?|installation[-\s]services?|what[-\s]we[-\s](?:offer|provide|do)|how[-\s]we[-\s](?:help|serve)|service[-\s](?:delivery|quality|commitment|guarantee|promise)|available[-\s]services?|core[-\s]services?|key[-\s]services?|main[-\s]services?|specialized[-\s]services?|industry[-\s]services?)/i;
const termsRegex =
  /(?:terms(?:[-\s](?:of[-\s](?:use|service|access)|and[-\s]conditions?|&[-\s]conditions?)?|conditions?(?:[-\s]of[-\s](?:use|service|access))?|legal[-\s](?:terms|information|notices?|disclaimer)|user[-\s]agreement|service[-\s]agreement|website[-\s]terms|acceptable[-\s]use[-\s]policy|usage[-\s]policy|guidelines?|rules[-\s]of[-\s]use|terms[-\s]policy|legal[-\s]terms|site[-\s]terms))/i;

const privacyRegex =
  /(?:privacy(?:[-\s](?:policy|notice|statement|terms|guidelines|information|practices|principles|rights|settings|preferences|center|hub))?|data[-\s](?:protection|privacy|collection|usage|processing)|cookie[-\s](?:policy|notice|preferences|settings)|personal[-\s](?:data|information)[-\s](?:policy|notice|protection)|gdpr|ccpa|privacy[-\s](?:&|and)[-\s]cookies?|your[-\s]privacy[-\s]rights)/i;

const faqRegex =
  /(?:faq|faqs|frequently[-\s]asked[-\s]questions|common[-\s](?:questions|queries)|help[-\s](?:center|desk|guide|section|articles?)|knowledge[-\s](?:base|center|hub)|support[-\s](?:center|hub|articles?)|how[-\s](?:to|it[-\s]works)|quick[-\s](?:help|guide|answers)|questions?[-\s](?:&|and)[-\s]answers?|troubleshooting[-\s]guide)/i;

const blogRegex =
  /(?:blog|blogs|news(?:[-\s](?:room|center|hub|feed|updates?|articles?|press|releases?|media))?|articles?|posts?|stories?|insights?|updates?|thought[-\s]leadership|knowledge[-\s](?:center|hub)|resource[-\s](?:center|hub)|learning[-\s](?:center|hub)|media[-\s](?:center|coverage)|press[-\s](?:room|releases?|coverage|kit)|publications?|case[-\s]studies?|white[-\s]papers?)/i;

const careersRegex =
  /(?:careers?(?:[-\s](?:opportunities|openings|positions|jobs|portal|center|page))?|jobs?(?:[-\s](?:opportunities|openings|positions|listings|board|portal))?|work[-\s](?:with[-\s]us|for[-\s]us|opportunities)|employment(?:[-\s]opportunities)?|join[-\s](?:our[-\s]team|us)|current[-\s](?:openings|positions|opportunities|vacancies)|job[-\s](?:listings?|opportunities|openings|positions)|hiring|vacancies|opportunities|recruitment|apply[-\s](?:now|here|today)|life[-\s]at)/i;

module.exports = {
  contactRegex,
  businessRegex,
  productsRegex,
  serviceRegex,
  termsRegex,
  privacyRegex,
  faqRegex,
  blogRegex,
  careersRegex,
};
