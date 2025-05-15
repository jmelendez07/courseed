from mongoengine import Document, StringField

class Institution(Document):
    name = StringField(required=True)
    image = StringField(required=False)

    meta = {
        "collection": "institutions"
    }