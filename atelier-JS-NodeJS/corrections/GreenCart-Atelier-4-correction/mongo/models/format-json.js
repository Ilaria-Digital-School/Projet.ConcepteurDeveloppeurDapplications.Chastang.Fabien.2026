// Réglage commun aux modèles : dans les réponses JSON de l'API,
// "_id" devient "id" et le champ technique "__v" disparaît.
// Ainsi les versions MongoDB et MySQL renvoient le même JSON.
module.exports = {
  versionKey: false,
  transform: (doc, ret) => {
    const { _id, ...reste } = ret;
    return { id: _id, ...reste };
  },
};
