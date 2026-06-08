# Figma Integration Skill

## Overview

This skill provides comprehensive Figma integration for implementing designs as production-ready code, connecting Figma components to code via Code Connect, and generating project-specific design system rules.

## When to Use This Skill

Activate this skill when the user:

- Provides a Figma URL and wants to implement the design as code
- Mentions: implement design, generate code, implement component, build Figma design, build components matching Figma specs
- Mentions: code connect, connect this component to code, map this component, link component to code, create code connect mapping
- Mentions: create design system rules, generate rules for my project, set up design rules, customize design system guidelines
- Wants to establish mappings between Figma designs and code implementations
- Wants to establish project-specific conventions for Figma-to-code workflows

## Available Figma MCP Tools

The Figma MCP server provides these tools (use via `mcp__plugin_figma_figma__<tool_name>`):

### Core Design Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `get_design_context` | **PRIMARY TOOL** - Get design context for a Figma node including reference code, screenshot, and metadata | `nodeId` (required), `fileKey` (required), `clientLanguages`, `clientFrameworks`, `forceCode`, `disableCodeConnect`, `excludeScreenshot` |
| `get_screenshot` | Generate a screenshot for a given node or selection | `nodeId` (required), `fileKey` (required), `maxDimension` (default: 1024), `contentsOnly`, `enableBase64Response` |
| `get_metadata` | Get metadata for a node/page in XML format (structure overview only) | `nodeId` (optional), `fileKey` (required) |
| `get_variable_defs` | Get variable definitions (colors, spacing, etc.) | `nodeId` (required), `fileKey` (required) |

### Code Connect Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `get_code_connect_suggestions` | Get AI-suggested strategy for linking Figma nodes to code components | `nodeId` (required), `fileKey` (required), `excludeMappingPrompt` |
| `send_code_connect_mappings` | Save multiple Code Connect mappings in bulk | `nodeId` (required), `fileKey` (required), `mappings` (required) |
| `get_code_connect_map` | Get mapping of nodeId to code component locations | `nodeId` (required), `fileKey` (required), `codeConnectLabel` |
| `add_code_connect_map` | Map a Figma node to a code component | `nodeId` (required), `fileKey` (required), `source` (required), `componentName` (required), `label` (required) |
| `get_context_for_code_connect` | Get structured component metadata for creating Code Connect templates | `nodeId` (required), `fileKey` (required) |

### Design System Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `create_design_system_rules` | Generate design system rules for the repository | `clientLanguages`, `clientFrameworks` |
| `search_design_system` | Search for design system assets (components, variables, styles) | `query` (required), `fileKey` (required), `includeComponents`, `includeVariables`, `includeStyles`, `includeLibraryKeys` |
| `get_libraries` | Get design libraries associated with a Figma file | `fileKey` (required), `offset` |

### File Creation & Manipulation Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `use_figma` | Run JavaScript in a Figma file via Plugin API (create, edit, delete, inspect objects) | `fileKey` (required), `code` (required), `description` (required), `skillNames` |
| `create_new_file` | Create a new blank Figma file | `fileName` (required), `planKey` (required), `editorType` (required: "design"/"figjam"/"slides"), `projectId` |
| `upload_assets` | Upload assets (images, etc.) into a Figma file | `fileKey` (required), `count`, `nodeId`, `scaleMode` |
| `generate_figma_design` | Capture/import/convert a web page or HTML into Figma design | `captureId`, `fileName`, `planKey`, `outputMode`, `fileKey`, `nodeId` |

### Diagram & FigJam Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `generate_diagram` | Create flowcharts, diagrams in FigJam using Mermaid.js | `name` (required), `mermaidSyntax` (required), `userIntent`, `planKey`, `fileKey` |
| `get_figjam` | Generate UI code for a FigJam node | `nodeId` (required), `fileKey` (required), `includeImagesOfNodes` |

### Utility Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `whoami` | Returns authenticated user information and plan details | None |

## URL Format Extraction

When the user provides a Figma URL, extract the `fileKey` and `nodeId`:

**Format:** `https://figma.com/design/:fileKey/:fileName?node-id=1-2`

- **fileKey:** `:fileKey` from the URL
- **nodeId:** Convert `1-2` to `1:2` (replace hyphen with colon)

**Branch URLs:** `https://figma.com/design/:fileKey/branch/:branchKey/:fileName`
- Use `:branchKey` as the `fileKey`

**FigJam URLs:** `https://figma.com/board/:fileKey/:fileName?node-id=1-2`

**Figma Make URLs:** `https://figma.com/make/:makeFileKey/:makeFileName`

## Workflow 1: Implement Design from Figma

### Step 1: Extract URL Parameters
```
User provides: https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=42-15

Extract:
- fileKey: kL9xQn2VwM8pYrTb4ZcHjF
- nodeId: 42:15 (convert hyphen to colon)
```

### Step 2: Fetch Design Context
```
Call: get_design_context
Parameters:
  - nodeId: "42:15"
  - fileKey: "kL9xQn2VwM8pYrTb4ZcHjF"
  - clientLanguages: "dart,typescript,javascript" (based on project)
  - clientFrameworks: "flutter,react,nextjs" (based on project)
  - excludeScreenshot: false (include screenshot for visual reference)
```

### Step 3: Analyze Response
The response includes:
- **Reference code** - Base implementation to adapt
- **Screenshot URL** - Visual reference (download with curl)
- **Asset URLs** - Images, icons, etc. to download
- **Metadata** - Colors, spacing, typography, layout properties

### Step 4: Download Assets
```bash
# Download screenshot
curl -s -o /tmp/figma_design.png "SCREENSHOT_URL"

# Download any referenced assets
curl -s -o /path/to/asset.png "ASSET_URL"
```

### Step 5: Adapt to Project Conventions
- Match existing component patterns in the codebase
- Use project's design tokens/theme system
- Follow project's naming conventions
- Integrate with existing state management
- Ensure accessibility compliance

### Step 6: Implement Component
Create the component file(s) following project structure:
- For Flutter: Create widget in appropriate feature folder
- For React/Next.js: Create component in components folder
- Include proper imports, props/parameters, styling
- Add documentation comments

### Step 7: Validate Implementation
- Check visual fidelity against screenshot
- Verify responsive behavior
- Test accessibility
- Ensure proper integration with existing code

## Workflow 2: Code Connect Components

### Step 1: Get Code Connect Suggestions
```
Call: get_code_connect_suggestions
Parameters:
  - nodeId: "42:15"
  - fileKey: "kL9xQn2VwM8pYrTb4ZcHjF"
  - clientLanguages: "dart,typescript"
  - clientFrameworks: "flutter,react"
```

### Step 2: Scan Codebase
Search for matching components in the codebase:
- Look for components with similar names
- Check component structure and props
- Verify component location and exports

### Step 3: Present Matches to User
Show suggested mappings:
```
Figma Component: "Button/Primary"
Suggested Code Component: "src/components/Button.tsx"
Component Name: "PrimaryButton"
Confidence: High
```

### Step 4: Create Mappings
```
Call: send_code_connect_mappings
Parameters:
  - nodeId: "42:15"
  - fileKey: "kL9xQn2VwM8pYrTb4ZcHjF"
  - mappings: [
      {
        "figmaNodeId": "42:15",
        "source": "src/components/Button.tsx",
        "componentName": "PrimaryButton",
        "label": "React"
      }
    ]
```

### Alternative: Manual Mapping
```
Call: add_code_connect_map
Parameters:
  - nodeId: "42:15"
  - fileKey: "kL9xQn2VwM8pYrTb4ZcHjF"
  - source: "lib/widgets/custom_button.dart"
  - componentName: "CustomButton"
  - label: "Flutter"
```

## Workflow 3: Create Design System Rules

### Step 1: Generate Rules
```
Call: create_design_system_rules
Parameters:
  - clientLanguages: "dart,typescript,javascript"
  - clientFrameworks: "flutter,react,nextjs"
```

### Step 2: Analyze Codebase
The tool will analyze:
- Existing component patterns
- Theme/styling conventions
- Naming patterns
- File structure
- Design token usage

### Step 3: Review Generated Rules
The tool returns a prompt with:
- Component implementation guidelines
- Naming conventions
- Styling patterns
- Accessibility requirements
- Best practices

### Step 4: Save Rules
Add the generated rules to your project documentation:
- For Claude Code: Add to `.claude/settings.json` or create `.claude/design-system-rules.md`
- For project docs: Add to `CLAUDE.md`, `README.md`, or dedicated design system docs

### Step 5: Validate Rules
Test the rules by implementing a sample component and verifying it follows the guidelines.

## Best Practices

### Design Implementation
1. **Always fetch design context first** - Use `get_design_context` as the primary tool
2. **Download screenshots** - Visual reference is critical for pixel-perfect implementation
3. **Match project conventions** - Adapt reference code to existing patterns
4. **Use design tokens** - Prefer project tokens over hardcoded values
5. **Maintain accessibility** - Ensure proper ARIA labels, contrast ratios, keyboard navigation

### Code Connect
1. **Verify component structure** - Ensure Figma component matches code component
2. **Use consistent naming** - Match Figma layer names to code component names when possible
3. **Document mappings** - Keep a record of all Code Connect mappings
4. **Test mappings** - Verify mappings work correctly in Figma's Dev Mode
5. **Publish components** - Code Connect only works with published Figma components

### Design System Rules
1. **Keep rules specific** - Vague rules are ignored; be explicit and actionable
2. **Include examples** - Show correct implementation patterns
3. **Update regularly** - Revise rules as design system evolves
4. **Prefix critical rules** - Use "IMPORTANT:" for must-follow guidelines
5. **Test rules** - Implement sample components to validate rule effectiveness

## Common Issues & Solutions

### Issue: Design context is truncated
**Solution:** Design is too complex. Use `get_metadata` to get structure, then fetch specific nodes individually.

### Issue: Assets not loading
**Solution:** Verify asset URLs are accessible. Download assets using curl and save to project assets folder.

### Issue: No Code Connect suggestions
**Solution:** Ensure component is published in Figma. Code Connect requires Organization/Enterprise plan.

### Issue: Design tokens differ from Figma
**Solution:** Prefer project tokens for consistency but adjust spacing/sizing to maintain visual fidelity.

### Issue: Screenshot quality is poor
**Solution:** Increase `maxDimension` parameter (default: 1024, max: 65536) for higher resolution.

### Issue: Reference code doesn't match project framework
**Solution:** Use reference code as a guide for layout/structure, but rewrite using project's framework and patterns.

## Integration with Project

### For Flutter Projects
```dart
// Example: Implementing a Figma button in Flutter
class FigmaButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final ButtonVariant variant;

  const FigmaButton({
    Key? key,
    required this.label,
    required this.onPressed,
    this.variant = ButtonVariant.primary,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Use theme tokens from Figma variables
    final theme = Theme.of(context);
    
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: variant == ButtonVariant.primary
            ? theme.colorScheme.primary
            : theme.colorScheme.secondary,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      child: Text(label),
    );
  }
}
```

### For React/Next.js Projects
```typescript
// Example: Implementing a Figma button in React
interface FigmaButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const FigmaButton: React.FC<FigmaButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
}) => {
  return (
    <button
      onClick={onClick}
      className={`figma-button figma-button--${variant}`}
      aria-label={label}
    >
      {label}
    </button>
  );
};
```

## Advanced Features

### Using `use_figma` for Direct Manipulation
```javascript
// Example: Create a component programmatically
const code = `
const frame = figma.createFrame();
frame.name = "Button";
frame.resize(120, 40);
frame.fills = [{type: 'SOLID', color: {r: 0.2, g: 0.4, b: 1}}];

const text = figma.createText();
await figma.loadFontAsync({family: "Inter", style: "Semi Bold"});
text.characters = "Click me";
text.fontSize = 14;
text.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];

frame.appendChild(text);
figma.currentPage.appendChild(frame);
`;

// Call use_figma with this code
```

### Searching Design System
```
Call: search_design_system
Parameters:
  - query: "button primary"
  - fileKey: "kL9xQn2VwM8pYrTb4ZcHjF"
  - includeComponents: true
  - includeVariables: true
  - includeStyles: true
```

### Creating Diagrams
```
Call: generate_diagram
Parameters:
  - name: "User Authentication Flow"
  - mermaidSyntax: "flowchart LR\n  A[\"User\"] --> B[\"Login\"]\n  B --> C{\"Valid?\"}\n  C -->|\"Yes\"| D[\"Dashboard\"]\n  C -->|\"No\"| E[\"Error\"]"
  - planKey: "team::abc123"
```

## Permission Management

Add Figma tool permissions to `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_figma_figma__get_design_context",
      "mcp__plugin_figma_figma__get_screenshot",
      "mcp__plugin_figma_figma__get_metadata",
      "mcp__plugin_figma_figma__get_variable_defs",
      "mcp__plugin_figma_figma__get_code_connect_suggestions",
      "mcp__plugin_figma_figma__send_code_connect_mappings",
      "mcp__plugin_figma_figma__create_design_system_rules",
      "mcp__plugin_figma_figma__search_design_system",
      "mcp__plugin_figma_figma__use_figma",
      "mcp__plugin_figma_figma__whoami",
      "Bash(curl -s -o /tmp/figma_*.png \"https://www.figma.com/api/mcp/asset/*\")",
      "Bash(curl -s -o */assets/* \"https://www.figma.com/api/mcp/asset/*\")"
    ]
  }
}
```

## Quick Reference

### Extract Figma URL
```
URL: https://figma.com/design/ABC123/MyFile?node-id=1-2
fileKey: ABC123
nodeId: 1:2
```

### Implement Design (Quick)
```
1. get_design_context(nodeId, fileKey)
2. Download screenshot and assets
3. Adapt reference code to project
4. Implement component
5. Validate against screenshot
```

### Code Connect (Quick)
```
1. get_code_connect_suggestions(nodeId, fileKey)
2. Review suggestions
3. send_code_connect_mappings(mappings)
```

### Design System Rules (Quick)
```
1. create_design_system_rules(languages, frameworks)
2. Review generated rules
3. Save to .claude/design-system-rules.md
```

## Resources

- [Figma Plugin API Documentation](https://www.figma.com/plugin-docs/)
- [Code Connect Documentation](https://www.figma.com/developers/code-connect)
- [Figma Variables Documentation](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
- [Figma Dev Mode](https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode)

---

**Last Updated:** May 13, 2026
**Version:** 1.0.0
