// design-token-hash: e848a41c344dc46f
import Foundation

enum DesignTokens {
  enum Color {
    static let background = "#f7f3ec"
    static let surface = "#fffdfa"
    static let primary = "#0c7c59"
    static let accent = "#ff6f5c"
    static let text = "#161512"
  }
  enum Font {
    static let displayFamily = "Fraunces, Georgia, serif"
    static let bodyFamily = "Source Sans 3, Avenir Next, sans-serif"
  }
  enum Radius {
    static let sm = "4px"
    static let md = "8px"
    static let lg = "14px"
  }
  // Cross-platform motion contract. Durations are SwiftUI seconds (Double).
  // framer-motion/motion consumes the CSS-variable form; SwiftUI/Flutter consume these.
  enum Motion {
    static let durationFast: Double = 0.12
    static let durationBase: Double = 0.22
    static let durationSlow: Double = 0.36
    static let reducedMotionDuration: Double = 0.0
    static let easing = "cubic-bezier(0.2, 0, 0, 1)"
  }
}
