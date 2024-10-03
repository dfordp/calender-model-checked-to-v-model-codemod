export default function transform(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let dirtyFlag = false;

  // Find all JSXElements
  root.find(j.JSXElement).forEach(path => {
    const openingElement = path.node.openingElement;

    // Check if the element has a v-model:checked directive
    openingElement.attributes.forEach(attr => {
      if (j.JSXAttribute.check(attr) && j.JSXNamespacedName.check(attr.name)) {
        const { namespace, name } = attr.name;

        // If the directive is v-model:checked, transform it to v-model
        if (namespace.name === 'v-model' && name.name === 'checked') {
          attr.name = j.jsxIdentifier('v-model');
          dirtyFlag = true;
        }
      }
    });
  });

  return dirtyFlag ? root.toSource() : undefined;
}


export const parser = "tsx";