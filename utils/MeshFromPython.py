import rhinoscriptsyntax as rs
import json

# monkey patch hack to getn json.dumps to format floats with at most three decimal places:
json.encoder.FLOAT_REPR = lambda f: ("%.3f" % f).rstrip('0').rstrip('.')


class Point:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z
        
def extractPoint(p):
  x = round(p.x, 3)
  y = round(p.y, 3)
  z = round(p.z, 3)
  point = {'x': x, 'y': y, 'z': z}
  return point


def dumps(data):
  return json.dumps(data, indent=2, sort_keys=True)
# select a mesh in Rhino
mesh_id = rs.GetObject("Select a mesh", rs.filter.mesh)

# convert mesh to triangles
rs.MeshQuadsToTriangles(mesh_id)

# extract mesh vertices and faces
vertices = rs.MeshVertices(mesh_id)
faces = rs.MeshFaceVertices(mesh_id)
colors = rs.MeshVertexColors(mesh_id)

vertices = [extractPoint(Point(x, y, z)) for x, y, z in vertices]
faces = [extractPoint(Point(a, b, c)) for index, a, b, c in faces]
if colors:
    colors = [extractPoint(Point(r, g, b)) for r, g, b in colors]

# convert vertices, faces, and colors to JSON format
data = {'vertices': vertices, 'faces': faces, 'colors': colors}

#prompt the user to specify a file name
filename = rs.SaveFileName("Save Segments As", None, None, 'mesh.json')
if filename:
  with open(filename, "w") as file:
    file.write(dumps(data))