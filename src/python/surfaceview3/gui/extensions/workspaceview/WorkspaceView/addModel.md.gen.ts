const text: string = "A *model* in surfaceview3 comprises a collection of surfaces and a collection of 3D vector fields that live in the same 3D space.\n\nTo add a model to this workspace, run a Python script on the computer running the backend service.\n\nHere is an example script that requires that you have access to a .vtk file in unstructured grid format:\n\n```python\nimport surfaceview3\n\n# Define the new model\nM = surfaceview3.Model('model1')\ns = surfaceview3.Surface.from_vtk_unstructured_grid('sha1://c5860c1d68f08635baac933bfa63160138a9097a/surf.vtk')\nM.add_surface('surface1', s)\n\n# Load the workspace and add the model\nW = surfaceview3.load_workspace('{workspaceUri}')\nW.add_model(M)\n```\n\nHere is an example script that assumes you have a URI for the serialized model:\n\n```python\nimport surfaceview3\n\n# Load the model to be added\nM = surfaceview3.Model.deserialize('sha1://..../model.json', label='model1')\n\n# Load the workspace and add the model\nW = surfaceview3.load_workspace('{workspaceUri}')\nW.add_model(M)\n```\n\nIn the context of the miniwasp project, you can generate a URI for a new model by running one of the [examples found here](https://github.com/magland/surfaceview3/tree/main/devel/miniwasp_examples). That will print a model URI to the console and you can use the above script to add the model to the workspace."

export default text