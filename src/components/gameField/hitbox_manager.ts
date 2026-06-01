export type BuildType = "house" | "road" | "big_house" | null;

export interface HitboxVisibilityConfig {
  showAll: boolean;
  selectedBuildType: BuildType;
}

export function shouldShowCornerHitbox(
  isDisabled: boolean,
  config: HitboxVisibilityConfig,
): number {
  if (isDisabled) return 0;
  
  if (!config.showAll) return 0;
  
  if (config.selectedBuildType === "house" || config.selectedBuildType === "big_house") {
    return 0.8;
  }
  
  return 0.4;
}

export function shouldShowEdgeHitbox(
  isDisabled: boolean,
  config: HitboxVisibilityConfig,
): number {
  if (isDisabled) return 0;
  
  if (!config.showAll) return 0;
  
  if (config.selectedBuildType === "road") {
    return 0.7;
  }
  
  return 0.3;
}

export function isValidBuild(
  buildType: BuildType,
  hitboxType: "corner" | "edge",
): boolean {
  if (!buildType) return false;
  
  if (hitboxType === "corner") {
    return buildType === "house" || buildType === "big_house";
  }
  
  if (hitboxType === "edge") {
    return buildType === "road";
  }
  
  return false;
}