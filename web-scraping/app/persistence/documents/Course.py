from mongoengine import Document, StringField, FloatField

class Course(Document):
    url = StringField(required=True, unique=True)
    title = StringField(required=True)
    image = StringField()
    description = StringField()
    prerequisites = StringField()
    price = FloatField()
    duration = StringField()
    modality = StringField()
    categoryId = StringField(required=True)
    institutionId = StringField(required=True)

    meta = {
        "collection": "courses"
    }