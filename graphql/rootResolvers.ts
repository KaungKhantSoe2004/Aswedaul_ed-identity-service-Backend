import { ActivityResolver } from "./activityResolver";
import { admissionResolver } from "./adminssionsResolver";
import { FaqResolver } from "./faqResolver";
import { GalleryResolver } from "./galleryResolver";
import { UserResolver } from "./userResolver";

export const rootResolvers = {
  // Query: {
  ...ActivityResolver,
  ...FaqResolver,
  ...admissionResolver,
  ...UserResolver,
  ...GalleryResolver,
  // },

  // Mutation: {
  // ...ActivityResolver.Mutation,
  // ...FaqResolver.Mutation,
  // ...admissionResolver.Mutation,
  // ...UserResolver.Mutation,
  // },
};
